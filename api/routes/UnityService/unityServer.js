var dgram = require("dgram");
const { send } = require("process");
const router = require("express").Router();
("use strict");

const fs = require('fs');

const { networkInterfaces } = require("os");
// const { isBooleanObject } = require("util/types");

const nets = networkInterfaces();
const results = {}; // Or just '{}', an empty object

var clients = [];
var syncObjects = [];


initData("SyncObjects.json");
// Es wird ebomData aus der Datenbank gelesen, wenn Einträge vorhanden sind, diese nehmen, ansonsten generischen Inhalt einfüllen
function initData (path, type){  
  try {
    if (fs.existsSync(path)) {
      let rawdata = fs.readFileSync(path);
      let data= JSON.parse(rawdata);

      if (data != null && data.length != 0){
          syncObjects = data;        
      }
    }
  } catch(err) {
    console.error(err)
  }  
}

router.route("/").get((req, res) => {
  // res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);

  res.render("multiplayerOverview", {
    clients: clients,
    items: syncObjects,
  });
});

router.route("/register").post((req, res) => {
  // console.log(req);
  res.render("multiplayerOverview", {
    clients: clients,
  });
});

var PORT = 33333;
// var HOST = "192.168.137.1";
// var HOST = "127.0.0.1;"
var HOST = "192.168.0.150";

var server = dgram.createSocket("udp4");

server.on("listening", function () {
  var address = server.address();
  console.log(
    "UDP Server listening on " + address.address + ":" + address.port
  );
});

server.on("message", function (message, remote) {
  var msg = JSON.parse(message.toString());

  // Neuen Client hinzufügen:
  if (msg.type == "RegisterRqt") {
    registerClient(msg, remote);
  }

  // Gameobject spawnen
  if (msg.type == "SpawnRqt") {
    spawnObject(msg, remote);
  }

  // Gameobject entfernen
  if (msg.type == "RemoveRqt") {
    removeObject(msg, remote);
  }

  // Gameobject updaten
  if (msg.type == "ChangeRqt") {
    changeObject(msg, remote);
  }

  // Variable synchronisieren
  if (msg.type == "SyncVarRqt") {
    syncVar(msg, remote);
  }

  // Client löschen:
  if (msg.type == "DeleteClientRqt") {
    // Client finden
    for (var i = 0; i < clients.length; i++){
      if (clients[i].address == remote.address){
        deleteClient(i);
        break;
      }
    }    
  }

});

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
    const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
    if (net.family === familyV4Value && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      results[name].push(net.address);
    }
  }
}
console.log(results);
if (results["Ethernet"] != null) console.log(results["Ethernet"][0]);
if (results["LAN-Verbindung* 10"] != null) {
  HOST = results["LAN-Verbindung* 10"][0];
} else if (results["Ethernet"] != null) {
  HOST = results["Ethernet"][0];
}

server.bind(PORT, HOST);

function registerClient(msg, remote) {
  var addNew = true;
  for (var i = 0; i < clients.length; i++) {
    if (clients[i].address == remote.address) {
      console.log("Client existiert bereits");
      sendAllObjects(i, "SpawnInfo");
      addNew = false;
      break;
    }
  }
  if (addNew) {
    console.log("Neuen Client hinzufügen");
    var client = {};
    client.address = remote.address;
    client.port = msg.port;
    client.name = msg.name;
    client.playerPrefabID = -1;
    clients.push(client);
    console.log(client);
    sendAllObjects(clients.length - 1, "SpawnInfo");
  }
}

function sendAllObjects(i, mode) {
  console.log("");
  console.log("Item amount: " + syncObjects.length);
  for (var j = 0; j < syncObjects.length; j++) {
    var obj = {};
    obj.type = mode;
    obj.bla = "Test";
    obj.ID = syncObjects[j].ID;
    obj.prefabName = syncObjects[j].prefabName;
    obj.name = syncObjects[j].name;
    obj.posX = syncObjects[j].posX;
    obj.posY = syncObjects[j].posY;
    obj.posZ = syncObjects[j].posZ;
    obj.rotX = syncObjects[j].rotX;
    obj.rotY = syncObjects[j].rotY;
    obj.rotZ = syncObjects[j].rotZ;
    obj.rotW = syncObjects[j].rotW;
    obj.scaleX = syncObjects[j].scaleX;
    obj.scaleY = syncObjects[j].scaleY;
    obj.scaleZ = syncObjects[j].scaleZ;
    obj.syncInfoString = syncObjects[j].syncInfoString;
    obj.parentID = ""; // msg.parentID;
    console.log(
      "Send Client " + clients[i].address + " spawnObject: " + obj.name
    );
    sendUDP(clients[i].address, clients[i].port, clients[i].name, obj);
  }
}

function removeObject(msg, remote) {
  console.log("");
  console.log("Removing Object data is sent: " + JSON.stringify(msg));

  for (var i = 0; i < syncObjects.length; i++) {
    if (syncObjects[i].ID == msg.ID) {
      var obj = {};
      obj.type = "RemoveInfo";
      obj.ID = msg.ID;

      obj.syncInfoString = msg.syncInfoString;
      obj.parentID = ""; // msg.parentID;
      for (var j = 0; j < clients.length; j++) {
        sendUDP(clients[j].address, clients[j].port, clients[j].name, obj);
      }
      // Jetzt noch Objekt entfernen:
      syncObjects.splice(i, 1);
      break;
    }
  }
}

function syncVar(msg, remote) {
  console.log("");
  console.log("Syncing Var is sent: " + JSON.stringify(msg));

  for (var i = 0; i < syncObjects.length; i++) {
    if (syncObjects[i].ID == msg.ID) {
      var obj = {};
      obj.ID = msg.ID;
      obj.type = "SyncVarInfo";
      obj.stats = msg.stats;
      obj.syncInfoString = msg.syncInfoString;
      obj.parentID = ""; // msg.parentID;
      for (var j = 0; j < clients.length; j++) {
        if (clients[j].address != remote.address) {
          sendUDP(clients[j].address, clients[j].port, clients[j].name, obj);
        }
      }
      break;
    }
  }
}

function spawnObject(msg, remote) {
  console.log("");
  console.log("Spawn new Object data is sent: " + JSON.stringify(msg));

  for (var i = 0; i < syncObjects.length; i++) {
    if (syncObjects[i].ID == msg.ID) {
      console.log("ID already existent");
      return;
    }
  }
  var obj = {};
  obj.type = "SpawnInfo";
  obj.ID = msg.ID;
  obj.prefabName = msg.prefabName;
  obj.name = msg.name;
  obj.posX = msg.posX;
  obj.posY = msg.posY;
  obj.posZ = msg.posZ;
  obj.rotX = msg.rotX;
  obj.rotY = msg.rotY;
  obj.rotZ = msg.rotZ;
  obj.rotW = msg.rotW;
  obj.scaleX = msg.scaleX;
  obj.scaleY = msg.scaleY;
  obj.scaleZ = msg.scaleZ;
  obj.syncInfoString = msg.syncInfoString;
  obj.parentID = ""; // msg.parentID;
  syncObjects.push(obj);
  
  for (var i = 0; i < clients.length; i++) {
    if (clients[i].address != remote.address) {
      sendUDP(clients[i].address, clients[i].port, clients[i].name, obj);
    }
    else if (obj.prefabName == "Player_Network"){
      // Falls das Objekt einen Player repräsentiert, dem entsprechenden Client diesen Player zuordnen
      clients[i].playerPrefabID = obj.ID;
    } 
  }
}

function changeObject(msg, remote) {
  for (var i = 0; i < syncObjects.length; i++) {
    if (syncObjects[i].ID == msg.ID) {
      syncObjects[i].type = "ChangeInfo";
      syncObjects[i].ID = msg.ID;
      syncObjects[i].prefabName = msg.prefabName;
      syncObjects[i].name = msg.name;
      syncObjects[i].posX = msg.posX;
      syncObjects[i].posY = msg.posY;
      syncObjects[i].posZ = msg.posZ;
      syncObjects[i].rotX = msg.rotX;
      syncObjects[i].rotY = msg.rotY;
      syncObjects[i].rotZ = msg.rotZ;
      syncObjects[i].rotW = msg.rotW;
      syncObjects[i].scaleX = msg.scaleX;
      syncObjects[i].scaleY = msg.scaleY;
      syncObjects[i].scaleZ = msg.scaleZ;
      syncObjects[i].syncInfoString = msg.syncInfoString;
      syncObjects[i].parentID = ""; // msg.parentID;
      for (var j = 0; j < clients.length; j++) {
        if (clients[j].address != remote.address) {
          sendUDP(
            clients[j].address,
            clients[j].port,
            clients[j].name,
            syncObjects[i]
          );
        }
      }
      break;
    }
  }
}

function deleteAll (){
  for (var i = 0; i < syncObjects.length; i++) {
    var obj = {};
    obj.type = "RemoveInfo";
    obj.ID = syncObjects[i].ID;

    obj.syncInfoString = syncObjects[i].syncInfoString;
    obj.parentID = ""; // msg.parentID;
    for (var j = 0; j < clients.length; j++) {
      sendUDP(clients[j].address, clients[j].port, clients[j].name, obj);
    }
  }
  // Jetzt noch Objekt entfernen:
  syncObjects = [];   
  clients = [];
}

router.route("/saveData").post((req, res) => {
  try {
    fs.writeFileSync("SyncObjects.json", JSON.stringify(syncObjects));
    console.log("SyncObjects.json has been saved with the server data");    
  } catch (err) {
    console.error(err);
  }
  res.redirect("/unityServer");
});
function deleteClient (clientIdx){
   for (var i = 0; i < syncObjects.length; i++) {
    if (clients[clientIdx] != null && clients[clientIdx].playerPrefabID == syncObjects[i].ID){
      var obj = {};
      obj.type = "RemoveInfo";
      obj.ID = syncObjects[i].ID;

      obj.syncInfoString = syncObjects[i].syncInfoString;
      obj.parentID = ""; // msg.parentID;
      for (var j = 0; j < clients.length; j++) {
        sendUDP(clients[j].address, clients[j].port, clients[j].name, obj);        
      }
      syncObjects.splice(i, 1);
      // Noch den Client entfernen
      clients.splice(clientIdx, 1);
    }
  }
}

function deleteItem (itemID){
  for (var i = 0; i < syncObjects.length; i++) {
    if (syncObjects[i].ID == itemID) {
      var obj = {};
      obj.type = "RemoveInfo";
      obj.ID = syncObjects[i].ID;

      obj.syncInfoString = syncObjects[i].syncInfoString;
      obj.parentID = ""; // msg.parentID;
      for (var j = 0; j < clients.length; j++) {
        sendUDP(clients[j].address, clients[j].port, clients[j].name, obj);
      }
      // Jetzt noch Objekt entfernen:
      syncObjects.splice(i, 1);
      break;
    }
  }
}

router.route("/deleteAll").post((req, res) => {
  deleteAll();
  res.redirect("/unityServer");
});

router.route("/deleteClient").post((req, res) => {
  deleteClient(req.body.ID);
  res.redirect("/unityServer");
});

router.route("/deleteItem").post((req, res) => {
  deleteItem(req.body.ID);
  res.redirect("/unityServer");
});

function sendUDP(address, port, name, message) {
  var data = Buffer.from(JSON.stringify(message));
  // console.log ("Sending " + message.type + " Message to " + address + ", " + port);
  server.send(data, port, address, function (error) {
    if (error) {
      console.log(error);
    } else {
    }
  });
}

module.exports = router;
