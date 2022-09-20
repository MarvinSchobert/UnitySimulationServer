const { Kafka, Partitioners } = require("kafkajs")
const router = require("express").Router();
var excel = require('excel4node');
const axios = require('axios');

const clientId = "my-app"
const brokers = ["localhost:9092"]
const kafka = new Kafka({ clientId, brokers })
const consumer = kafka.consumer({ groupId: clientId })
const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })

var timeScale = 20000;
var startSimTime;
var timeCounter;

var tasks = []
var resources = []

var log = []
var auftraege = []

// Kafka-Sachen:

// Nachricht senden
const produce = async (topic, data, parameter) => {
	await producer.connect()
  try {
    await producer.send({
      topic: topic,
      messages: [
        {
          key: "Nachricht",
          value: JSON.stringify({"id": data.id,  "eventKey":"simulationMessage" ,"Nachricht": parameter}),
        },
      ],
    })
  } catch (err) {
    console.error("could not write message " + err)
  }	
}


// Nachricht empfangen
const consume = async () => {
	await consumer.connect()
	await consumer.subscribe({topics: ["message-process"]})
	await consumer.run({ 
		eachMessage:  async ({message}) => {
        },  
    })
}

var simDifference
var restartSim = false

async function routine (){
    // Set Up
    restartSim = false;
    startSimTime = new Date()
    var d = new Date()
    d.setHours(8,0,0)
    simDifference = startSimTime - d

    // Ressourcen initialisieren
    

    // Simulationsfluss
    while (!restartSim){

    }
}


function initData (path, type){  
    try {
      if (fs.existsSync(path)) {
        let rawdata = fs.readFileSync(path);
        let data= JSON.parse(rawdata);
  
        if (data != null && data.length != 0){
          if (type == "kunden"){
              kundenData = data;
          }
        }
        else {
          pushNewData(type)
        }
      }
      else {
        pushNewData(type)
      }
    } catch(err) {
      console.error(err)
    }  
  }
