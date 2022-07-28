var dgram = require("dgram");
const router = require("express").Router();

var clients = [];

router.route("/").get((req, res) => {
  // res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
  res.render("index", {
    clients: clients,
  });
});

router.post("/SendUDPMessage", async (req, res) => {
  console.log("Sending UDP Message");
  let headers = {
    Authorization: "Basic bWFydmluc2Nob2JlcnQ6UERBLVgtRmFtaWx5Pw==",
    "Content-Type": "application/json",
  };
  const response = await axios.post(
    "https://pdarobe.io/work/process-api/runtime/process-instances/",
    {
      processDefinitionKey: "queryProjectDataProcess",
      name: "Query Project Data Process From REST",
    },
    {
      headers: headers,
    }
  );
  console.log(response.data);
  res.redirect("/");
});

var PORT = 33333;
var HOST = "127.0.0.1";

var server = dgram.createSocket("udp4");

server.on("listening", function () {
  var address = server.address();
  console.log(
    "UDP Server listening on " + address.address + ":" + address.port
  );
});

server.on("message", function (message, remote) {
  console.log(remote.address + ":" + remote.port + " - ");
  var msg = JSON.parse(message.toString());
  // Neuen Client hinzufügen:
  var addNew = true;
  for (var i = 0; i < clients.length; i++) {
    if (clients[i].address == remote.address) {
      console.log("Client existiert bereits");
      addNew = false;
      break;
    }
  }
  if (addNew) {
    console.log("Neuen Client hinzufügen");
    var client = {};
    client.address = remote.address;
    client.port = remote.port;
    client.name = msg.name_;
    clients.push(client);
    console.log(client);
  }
});

server.bind(PORT, HOST);

function sendUDP() {
  var data = Buffer.from("Hello back from Webserver");
  server.send(data, 7788, "localhost", function (error) {
    if (error) {
      console.log(error);
      client.close();
    } else {
      console.log("Data is sent !");
    }
  });
}

module.exports = router;
