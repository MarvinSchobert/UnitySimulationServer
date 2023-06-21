var dgram = require("dgram");
const { send } = require("process");
const router = require("express").Router(); ("use strict");

const fs = require('fs');

var clients = [];
var objects = [];

var obj_id_counter = 0;
var client_id_counter = 0;

var clientLeaderIdx; // the client that controls Physics and Motion Simulation

// SERVER SETUP
var PORT = 33333;
// var HOST = "192.168.0.150";
var HOST = "192.168.137.1";
var server = dgram.createSocket("udp4");
server.bind(PORT, HOST);

server.on("listening", function () {
    var address = server.address();
    console.log(
        "UDP Server listening on " + address.address + ":" + address.port
    );
});

initData("CrossPlatformSession.json");

server.on("message", function (message, remote) {

    var msgs = JSON.parse(message.toString());
    if (msgs.sendObjects != null) {
        msgs.sendObjects.forEach(msg => {
            switch (msg.type.toString()) {
                case "UNREGISTER": unregisterRqt(msg, remote); break;
                case "REGISTER": registerRqt(msg, remote); break;
                case "CREATE": createReq(msg, remote); break;
                case "READ": readRqt(msg, remote); break;
                case "UPDATE": updateRqt(msg, remote); break;
                case "DELETE": deleteRqt(msg, remote); break;
                case "CLIENT_LEADERSHIP_REQUEST": break;
            }
        });
    }
});

// INITIALIZATION
function initData(path) {
    // erst Speicherstand abfragen
    try {
        if (fs.existsSync(path)) {
            let rawdata = fs.readFileSync(path);
            let data = JSON.parse(rawdata);

            if (data != null && data.length != 0) {
                objects = data;
            }
        }
    } catch (err) {
        console.error(err)
    }
}

//  UNREGISTER
function unregisterRqt(msg, remote) {
   deleteClient(msg.clientId);
}


//  REGISTER
function registerRqt(msg, remote) {
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].address == remote.address && clients[i].port == msg.port) {
            console.log("\n[REGISTER] Client " + clients[i].userName + "(" + clients[i].address + ": " + clients[i].port + ") has been registered already.");
            return;
        }
    }

    // Client is not registered yet    
    var client = {};
    client.address = remote.address;
    client.port = msg.port;
    client.userName = msg.userName;
    client.clientId = ++client_id_counter;
    clients.push(client);
    console.log("[REGISTER] Client " + client.userName + " (" + client.address + ":" + client.port + ") will be registered.");
    // Send client ID to client
    var res = {};
    res.id = client.clientId ;
    res.type = "REGISTER_ID_RESPONSE";
    // dem Sender die ID mitteilen
    sendMessage(remote.address, client.port, res);

    // Send all existing objects to client
    for (var i = 0; i < objects.length; i++) {
        var obj = objects[i];
        obj.type = "CREATE";
        sendMessage(client.address, client.port, obj);
    }

    // Check if client is only client
    if (clients.length == 1) {
        clientLeaderIdx = 0;
        // Inform client about new leadership
        var information = {};
        information.type = "CLIENT_LEADERSHIP";
        sendMessage(client.address, client.port, information)
        console.log("[REGISTER] Informing Client about Leadership.")
    }
}

function createReq(msg, remote) {
    console.log("[CREATE]: Object will be created.")
    // Zunächst ID verteilen:
    var id = (++obj_id_counter).toString();
    var res = {};
    res.id = id;
    res.reqId = msg.reqId;
    res.type = "CREATE_ID_RESPONSE";

    msg.id = id;
    objects.push(msg);
    msg.type = "CREATE";
    // dem Sender die ID mitteilen
    sendMessage(remote.address, getClientPort(msg.clientId), res);
    // Allen außer dem Sender einen Create-Request schicken
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].port.toString() != getClientPort(msg.clientId)) {
            sendMessage(clients[i].address, clients[i].port, msg);
        }
    }
}

// TODO READ
function readRqt(msg, remote) {

}

function updateRqt(msg, remote) {
    console.log("[UPDATE]: Object will be updated.")
    var objIdx = -1;
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].id.toString() == msg.id.toString()) {
            objIdx = i;
            break;
        }
    }
    objects[objIdx] = msg;
    msg.type = "UPDATE";

    // Allen außer dem Sender einen Create-Request schicken
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].port.toString() != getClientPort(msg.clientId)) {
            sendMessage(clients[i].address, clients[i].port, msg);
        }
    }
}

// TODO DELETE
function deleteRqt(msg, remote) {
    
}

// SENDMESSAGE
function sendMessage(address, port, msg) {
    var data = Buffer.from(JSON.stringify(msg));
    server.send(data, port, address, function (error) {
        if (error) {
            console.log(error);
        } else {

        }
    });
}

function getClientPort (clientId){
    for (var i = 0; i < clients.length; i++){
        if (clients[i].clientId.toString() == clientId.toString()){
            return clients[i].port;
        }
    }
    return null;
}

// DELETING ITEM
function deleteItem(itemID) {
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].id == itemID) {
            var obj = {};
            obj.type = "DELETE";
            obj.id = objects[i].id;
            for (var j = 0; j < clients.length; j++) {
                sendMessage(clients[j].address, clients[j].port, obj);
            }
            // Jetzt noch Objekt entfernen:
            objects.splice(i, 1);
            console.log("[DELETE] Deleting Item with ID " + obj.id + ".");
            break;
        }
    }
}

// DELETING CLIENT
function deleteClient(clientId){
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].clientId.toString() == clientId.toString()) {
            console.log("\n[UNREGISTER] Client " + clients[i].userName + "(" + clients[i].address + ": " + clients[i].port + ") will be unregistered.");
            clients.splice(i, 1);
            break;
        }
    }

    // delete all objects connected to this client:
    for (var j = 0; j < objects.length; j++){
        if (objects[j].deleteOnClientQuit.toString() == "True" && objects[j].ownerClientId.toString() == clientId.toString()){
            deleteItem(objects[j].id);
            j--;
        }
    }
}


// SAVING TO FILE
router.route("/saveData").post((req, res) => {
    try {
        fs.writeFileSync("CrossPlatformSession.json", JSON.stringify(objects));
        console.log("CrossPlatformSession.json has been saved with the server data");
    } catch (err) {
        console.error(err);
    }
    res.redirect("/unityServer");
});

router.route("/deleteItem").post((req, res) => {
    deleteItem(req.body.id);
    res.redirect("/unityServer");
});

router.route("/deleteClient").post((req, res) => {
    deleteClient(req.body.clientId);
    res.redirect("/unityServer");
});


router.route("/").get((req, res) => {
    res.render("multiplayerOverview", {
        clients: clients,
        items: objects,
    });
});

module.exports = router;