const { Kafka, Partitioners } = require("kafkajs")

const router = require("express").Router();
var excel = require('excel4node');

const axios = require('axios');


const clientId = "my-app"
const brokers = ["localhost:9092"]
const kafka = new Kafka({ clientId, brokers })
const consumer = kafka.consumer({ groupId: clientId })
const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
var timeScale = 15000;//600; // 1 ms in der Simulation entsprechen timeScale ms in echt --> gerade pro ms Simulation: 600 ms in echt (bzw. 1 s = 10 min)
var startSimTime;

var gesamtEinnahmen = 0;

var timeCounter = 0;

const bestellungAufgeben = async () => {
	await producer.connect()
  try {
    id= "bestellung"+Math.floor(Math.random() * 10000);
    produktbezeichnung = "Computer"
    menge = 1

    await producer.send({
      topic: "messageorder",
      messages: [
        {
          key: "Nachricht",
          value: JSON.stringify({"eventKey":"abc" , "produktbezeichnung": produktbezeichnung, "menge": menge, "id": id}),
        },
      ],
    })
    console.log("Bestellung " + id + " wurde aufgegeben");

    // Zeit beim ersten Reset resetten
    if (auftraege.length == 0){
      startSimTime = new Date ()
    }

    var d = {};
    d.bestellID = id;
    d.messages = [];
    d.startTime = adjustToSimTime(timeCounter)
    log.push (d);
    

    auftraege.push ({"id": id, "startTime": d.startTime, "produktbezeichnung": produktbezeichnung, "menge": menge, "tasks":[], "taskNames":[]});

  } catch (err) {
    console.error("could not write message " + err)
  }
	
}


const produce = async (data, parameter) => {
	await producer.connect()
  try {
    await producer.send({
      topic: "messageservices",
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

var tasks = [];
var workers = []; // 
var log = [];
var auftraege = [];

const consume = async () => {
	await consumer.connect()
	await consumer.subscribe({topics: ["message-process"]})
	await consumer.run({ 
		eachMessage:  async ({message}) => {
      var request = JSON.parse(message.value)
      var simulationReq = request.simulationRequest
      var res = 0;
      
      var rnd = Math.floor(Math.random() * 100)
      var requiredTimeMS = 1000 * request.menge; // eine Sekunde pro Auftrag

      var task = {};
      task.remainingTime = requiredTimeMS
      task.request = request
      task.aktuellBearbeitet = false
      task.canComplete = true;

      task.type = simulationReq;
      task.storeText = "Nr. " + request.id +": " + simulationReq;
      task.remainingTime = request.bearbeitungsdauerSekunden * 1000 // Millisekunden

      // Innendienst
      if (simulationReq == "bestellungSichten"){       
        task.verantwortung = "Innendienst"
        if (rnd <30) res = 1;   
        if (rnd > 55) res = 2;  
      }
      else if (simulationReq == "bestellungKlaeren"){        
        task.verantwortung = "Innendienst"
        if (rnd <60) res = 1;      
      }
      else if (simulationReq == "bestellungDigitalisieren"){
        task.verantwortung = "Innendienst"               
        if (rnd <50) res = 1;  
      }
      else if (simulationReq == "datenPruefen"){
        task.verantwortung = "Innendienst"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "mitKundeKlaeren"){
        task.verantwortung = "Innendienst"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "rechnungStellen"){
        task.verantwortung = "Innendienst"
        gesamtEinnahmen += 250;        
        if (rnd <50) res = 1;    
      }

      // Produktionsplanung
      else if (simulationReq == "auftragPruefen"){
        task.verantwortung = "Produktionsplanung"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "auftragNachbearbeiten"){
        task.verantwortung = "Produktionsplanung"
        if (rnd <40) res = 1;      
        else if (rnd <70) res = 2;  
      }
      else if (simulationReq == "produktionPlanen"){
        task.verantwortung = "Produktionsplanung"
        if (rnd <40) res = 1;      
        else if (rnd <70) res = 2;  
      }
      else if (simulationReq == "warenBuchen"){
        task.verantwortung = "Produktionsplanung"
        if (rnd <40) res = 1;      
        else if (rnd <70) res = 2;  
      }
      else if (simulationReq == "verfuegbarkeitPruefen"){
        task.verantwortung = "Produktionsplanung"
        task.canComplete = false;
        if (rnd <50) res = 1;      
      }
      else if (simulationReq == "rohmaterialVerfuegbarkeitPruefen"){
        task.verantwortung = "Produktionsplanung"
        task.canComplete = false;
        if (rnd <50) res = 1;      
      }
      else if (simulationReq == "materialbedarfUebermitteln"){
        task.verantwortung = "Produktionsplanung"
        if (rnd <50) res = 1;      
      }

      // Supply Chain Management
      else if (simulationReq == "materialbedarfPruefen"){
        task.verantwortung = "SupplyChainManagement"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "lieferantenAussuchen"){
        task.verantwortung = "SupplyChainManagement"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "materialBestellen"){
        task.verantwortung = "SupplyChainManagement"
        if (rnd <50) res = 1;    
      }

      // Logistik
      else if (simulationReq == "lieferungEntgegennehmen"){
        task.verantwortung = "Logistik"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "lieferungEintragen"){
        task.verantwortung = "Logistik"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "lieferungEinlagern"){
        task.verantwortung = "Logistik"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "produktentnahmeEintragen"){
        task.canComplete = false;
        task.verantwortung = "Logistik"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "liefern"){
        task.verantwortung = "Logistik"
        if (rnd <50) res = 1;    
      }

       // Produktion
      else if (simulationReq == "materialEntnehmen"){
        task.canComplete = false;
        task.verantwortung = "Produktionsmitarbeiter"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "kommissionieren"){
        task.verantwortung = "Produktionsmitarbeiter"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "eintragen"){
        task.canComplete = false;
        task.verantwortung = "Produktionsmitarbeiter"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "transportieren"){
        task.verantwortung = "Förderband"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "bearbeiten"){
        task.verantwortung = "Maschine"
        if (rnd <50) res = 1;    
      }
     
     
      


      task.res = res
      task.abgeschlossen = false
      task.startTime = adjustToSimTime(timeCounter)
     

      // Dem Auftrag den Task zuweisen
      for (var t = 0; t < auftraege.length; t++){
        if (auftraege[t].id == task.request.id){
          auftraege[t].tasks.push (tasks.length)
          auftraege[t].taskNames.push (simulationReq)
          task.auftrag = t;
          if (simulationReq == "rechnungStellen"){
            auftraege[t].successful = true;
          }
          break;
        }
      }
      tasks.push(task);  
    },  
  })
}

var simDifference
var restartSim = false;

async function routine (){
  restartSim = false;
  startSimTime = new Date()
  var d = new Date()
  d.setHours(8,0,0)
  simDifference = startSimTime - d
  var skip = false

  const names = ["Andrew Aguilar", "Ryan Schwartz", "Joshua Gonzalez", "Justin Butler", "Brandon Garcia", "John Torres", "Roberto Brown", "Travis Hill", "Alexander Brown"]
  // Init two Innendienst Workers
  for (var i = 0; i < 1; i++){
    var worker = {}
    worker.aktuelleAufgabe = -1
    worker.verantwortung = "Innendienst"
    worker.tasks = []
    worker.name = names [Math.floor(Math.random() * names.length)]
    worker.gehaltprojahr = 65000
    worker.arbeitszeitprojahr_minuten = 90000
    workers.push(worker)    
  }

  // Init one Produktionsplanungs Worker
  for (var i = 0; i < 1; i++){
    var worker = {}
    worker.aktuelleAufgabe = -1
    worker.verantwortung = "Produktionsplanung"
    worker.tasks = []
    worker.name = names [Math.floor(Math.random() * names.length)]
    worker.gehaltprojahr = 80000
    worker.arbeitszeitprojahr_minuten = 90000
    workers.push(worker)    
  }
  for (var i = 0; i < 1; i++){
    var worker = {}
    worker.aktuelleAufgabe = -1
    worker.verantwortung = "Logistik"
    worker.tasks = []
    worker.name = names [Math.floor(Math.random() * names.length)]
    worker.gehaltprojahr = 45000
    worker.arbeitszeitprojahr_minuten = 100000
    workers.push(worker)    
  }
  for (var i = 0; i < 1; i++){
    var worker = {}
    worker.aktuelleAufgabe = -1
    worker.verantwortung = "Produktionsmitarbeiter"
    worker.tasks = []
    worker.name = names [Math.floor(Math.random() * names.length)]
    worker.gehaltprojahr = 45000
    worker.arbeitszeitprojahr_minuten = 100000
    workers.push(worker)    
  }
  for (var i = 0; i < 1; i++){
    var worker = {}
    worker.aktuelleAufgabe = -1
    worker.verantwortung = "SupplyChainManagement"
    worker.tasks = []
    worker.name = names [Math.floor(Math.random() * names.length)]
    worker.gehaltprojahr = 80000
    worker.arbeitszeitprojahr_minuten = 90000
    workers.push(worker)    
  }
  for (var i = 0; i < 1; i++){
    var worker = {}
    worker.aktuelleAufgabe = -1
    worker.verantwortung = "Maschine"
    worker.tasks = []
    worker.name = names [Math.floor(Math.random() * names.length)]
    worker.gehaltprojahr = 20000
    worker.arbeitszeitprojahr_minuten = 525600
    workers.push(worker)    
  }
  for (var i = 0; i < 1; i++){
    var worker = {}
    worker.aktuelleAufgabe = -1
    worker.verantwortung = "Förderband"
    worker.tasks = []
    worker.name = names [Math.floor(Math.random() * names.length)]
    worker.gehaltprojahr = 5000
    worker.arbeitszeitprojahr_minuten = 525600
    workers.push(worker)    
  }

  while (!restartSim){
    
    // ggf. zufällig Bestellung tätigen:
    if (bestellungenQueue > 0 && Math.random()*100>98){
      await bestellungAufgeben();
      bestellungenQueue--;
    }
    var simActive = false;
    workers.forEach( (worker) => {
      // Neuen Task nehmen
      if (worker.aktuelleAufgabe == -1){
        for (var j = 0; j < tasks.length; j++){
          if (!tasks[j].abgeschlossen && tasks[j].aktuellBearbeitet == false && worker.verantwortung == tasks[j].verantwortung)
          {
            // Auswahl überlegen bzgl. Umrüstzeit etc.
            if (worker.tasks.length != 0 && tasks[j].request.simulationRequest != tasks[ worker.tasks[worker.tasks.length-1]].request.simulationRequest){
              // Sozusagen Umrüstzeit bei der Aufgabenbearbeitung
              tasks[j].remainingTime = Math.floor(tasks[j].remainingTime*1)
            }
            
            // Aufgabe auswählen
            store (tasks[j].request.id, tasks[j].storeText + " begonnen", true)
            tasks[j].aktuellBearbeitet = true
            tasks[j].startTime = adjustToSimTime(timeCounter)
            tasks[j].bearbeiter = worker.name
            worker.aktuelleAufgabe = j
            worker.tasks.push (j)
            simActive = true;
            if (tasks[worker.aktuelleAufgabe].request.simulationRequest == "verfuegbarkeitPruefen"){
              verfuegbarkeitPruefen(j, auftraege[tasks[worker.aktuelleAufgabe].auftrag]);
            }
            else if (tasks[worker.aktuelleAufgabe].request.simulationRequest == "rohmaterialVerfuegbarkeitPruefen"){
              rohmaterialVerfuegbarkeitPruefen(j, auftraege[tasks[worker.aktuelleAufgabe].auftrag]);
            }
            else if (tasks[worker.aktuelleAufgabe].request.simulationRequest == "materialEntnehmen"){
              materialEntnehmen(j, "Chip");
            }
            else if (tasks[worker.aktuelleAufgabe].request.simulationRequest == "produktentnahmeEintragen"){
              materialEntnehmen(j, auftraege[tasks[worker.aktuelleAufgabe].auftrag].produktbezeichnung);
            }
            else if (tasks[worker.aktuelleAufgabe].request.simulationRequest == "eintragen"){
              materialHinzufügen(j, auftraege[tasks[worker.aktuelleAufgabe].auftrag].produktbezeichnung);
            }
            break;
          }
        }
      }
      // Aufgabe bearbeiten
      else {
        // var time_hour = Date.now().getHours 
        // if (time_hour < 18 && time_hour > 8)
        // tasks[worker.aktuelleAufgabe].remainingTime -= 10 * timeScale //Milliseconds
        simActive = true;

          // Aufgabe abgeschlossen
          if (tasks[worker.aktuelleAufgabe].canComplete && (adjustToSimTime(timeCounter) - tasks[worker.aktuelleAufgabe].startTime) >= tasks[worker.aktuelleAufgabe].remainingTime){
           

            produce(tasks[worker.aktuelleAufgabe].request, {res: tasks[worker.aktuelleAufgabe].res}).catch((err) => {
              console.error("error in consumer: ", err)
            })
            store (tasks[worker.aktuelleAufgabe].request.id, tasks[worker.aktuelleAufgabe].storeText + " fertig", true)
            tasks[worker.aktuelleAufgabe].abgeschlossen = true;
            tasks[worker.aktuelleAufgabe].endTime = adjustToSimTime(timeCounter)
            // Kosten der Aufgabe bestimmen
            tasks[worker.aktuelleAufgabe].kosten = worker.gehaltprojahr / worker.arbeitszeitprojahr_minuten * ((tasks[worker.aktuelleAufgabe].endTime - tasks[worker.aktuelleAufgabe].startTime)/1000/60)
            worker.aktuelleAufgabe = -1;           
            // console.log("Worker available again.");  
          }
      }
    });
    await sleep (2)
    if (simActive && !skip){
      timeCounter += (4*timeScale);
    }
    skip = !skip
  }

  // Simulation restarten

  gesamtEinnahmen = 0;
  auftraege = [];
  startSimTime = 0;
  timeCounter = 0;
  tasks = [];
  workers = [];
  log = [];
  simDifference = 0;
  routine();
 
}

routine();

async function materialEntnehmen (taskID, _itemName){
  await axios.post("http://localhost:3000/erpSystem/wareEntnehmen/", {
    itemName: _itemName,
    itemAnzahl: 1
  })  
  tasks[taskID].canComplete = true;
}

async function materialHinzufügen (taskID, _itemName){
  await axios.get("http://localhost:3000/erpSystem/wareVerbuchen/", {
    itemName: _itemName,
    itemAnzahl: 1
  })  
  tasks[taskID].canComplete = true;
}

async function verfuegbarkeitPruefen (taskID, auftrag){
    const materialVerfuegbarkeit = await axios.get("http://localhost:3000/erpSystem/warePruefen/" + auftrag.produktbezeichnung + "/" + auftrag.menge)
    if (materialVerfuegbarkeit.data.itemAvailable){
      tasks[taskID].res = 0;
      console.log ("1 true");
    } else {
      tasks[taskID].res = 1;
      console.log ("1 false");
    }
    
    tasks[taskID].canComplete = true;
}
async function rohmaterialVerfuegbarkeitPruefen (taskID, auftrag){
  const resultBOM = await axios.get("http://localhost:3000/plmSystem/getProductBOM/" + auftrag.produktbezeichnung)
  var available = true;
  console.log(resultBOM.data)
  for (var i = 0; i < resultBOM.data.BOM.length; i++){
    const materialVerfuegbarkeit = await axios.get("http://localhost:3000/erpSystem/warePruefen/" + resultBOM.data.BOM[i] + "/1")
    if (!materialVerfuegbarkeit.data.itemAvailable){
      available = false;
    }
  }
  if (available){
    tasks[taskID].res = 0;
    console.log ("2 true");
  } else {
    tasks[taskID].res = 1;
    console.log ("2 false");
  }
  c
  tasks[taskID].canComplete = true;
}

function store (bestellID, text, show=false){
  for (var i = 0; i < log.length; i++){
    if (log[i].bestellID == bestellID){
      var time = adjustToSimTime(timeCounter)
      log[i].messages.push({"message": text, "time" : time, "deltaTimeMS": new Date (time)- new Date(log[i].startTime)});
      if (false && show){
        console.log("");
        for (var j = 0; j < log[i].messages.length; j++){
          console.log (JSON.stringify(log[i].messages[j]));          
        }      
        console.log("")
      }
    }  
  }
  
}

consume().catch((err) => {
	console.error("error in consumer: ", err)
})

var bestellungenQueue = 0;

router.route("/order/:number").get(async (req, res) => {
  bestellungenQueue += req.params.number;
  res.send ("Es werden " + req.params.number + " Bestellungen getätigt.");
});

router.route("/order").post(async (req, res) => {
  console.log(req.body)
  bestellungenQueue += req.body.anzahl;
  res.redirect("/simulationServer")
});

router.route("/reset").post(async (req, res) => {
  restartSim = true;
  res.redirect("/simulationServer")
});

router.route("/").get(async (req, res) => {

  // TODO: Durchlaufzeit, Auslastungsquoten und ROI Gesamt und pro Variante  berechnen und anzeigen
  var calculationResults = []
  // Prozessvarianten finden
  var processVariants = []
  var gesamtAusgaben = 0
  var gesamtWertschöpfung = 0
  var workerStats = []
  
  for (var i = 0; i < auftraege.length; i++){
    var isNewVariant = true
    for (var j = 0; j < processVariants.length; j++){
      if (auftraege[i].taskNames.toString() == processVariants[j].taskNames.toString()){
        // Der Variante einen Counter hinzufügen:
        processVariants[j].counter++;
        processVariants[j].auftraege.push(auftraege[i].id)
        var time = tasks[auftraege[i].tasks[auftraege[i].tasks.length-1]].endTime - auftraege[i].startTime;
        processVariants[j].totalTime += time;
        for (var k = 0; k < auftraege[i].tasks.length; k++){
          processVariants[j].kosten += tasks[auftraege[i].tasks[k]].kosten
        }
        isNewVariant = false;
      }
    }    

    if(isNewVariant){
      var obj = {}
      var taskNames = auftraege[i].taskNames
      obj.taskNames = taskNames   
      obj.auftraege = []
      obj.auftraege.push(auftraege[i].id) 
      obj.kosten = 0
      for (var k = 0; k < auftraege[i].tasks.length; k++){
        obj.kosten += tasks[auftraege[i].tasks[k]].kosten
      }
      
      obj.counter = 1
      var time = tasks[auftraege[i].tasks[auftraege[i].tasks.length-1]].endTime - auftraege[i].startTime
      obj.totalTime = time
      processVariants.push(obj);
    }
  }

  // Auslastungen finden:
  if (auftraege.length != 0){
    var completeSimTime = getEndOfSimTime() - auftraege[0].startTime
    console.log("Complete Sim: " + completeSimTime / 1000 / 60 + " min")   
    for (var i = 0; i < workers.length; i++){
      var obj = {}
      obj.name = workers[i].name
      obj.workingTime = 0
      for (var t = 0; t < workers[i].tasks.length; t++){
        obj.workingTime += (tasks[workers[i].tasks[t]].endTime - tasks[workers[i].tasks[t]].startTime)
      }
      obj.completeSimTime = completeSimTime;
      obj.wertschöpfung = obj.workingTime/1000/60 * workers[i].gehaltprojahr/ workers[i].arbeitszeitprojahr_minuten;
      obj.bezahlung = completeSimTime/1000/60 * workers[i].gehaltprojahr/ workers[i].arbeitszeitprojahr_minuten;
      obj.abteilung = workers[i].verantwortung
      gesamtAusgaben += obj.bezahlung
      gesamtWertschöpfung += obj.wertschöpfung
      workerStats.push(obj)
    }
    createExcelDocument();
  }

  calculationResults.gesamtEinnahmen = gesamtEinnahmen;
  calculationResults.gesamtAusgaben = gesamtAusgaben;
  calculationResults.gesamtWertschöpfung = gesamtWertschöpfung
  calculationResults.workerResults = workerStats
  calculationResults.processVariants = processVariants

    
  

  // Kapazitäten anzeigen
  res.render("simulationOverview", {
    calculationResults: calculationResults
  });
});

function getEndOfSimTime (){
  var res = 0
  for (var i = 0; i < tasks.length; i++){
    if (tasks[i].endTime > res){
      res = tasks[i].endTime 
    }
  }
  return res;
}


function createExcelDocument (){
  // Create a new instance of a Workbook class
  var workbook = new excel.Workbook();

  // Add Worksheets to the workbook
  var worksheet = workbook.addWorksheet('Bestellungen');
  var worksheet2 = workbook.addWorksheet('Aufgaben');

  // Create a reusable style
  var style = workbook.createStyle({
    font: {
      // color: '#FF0800',
      size: 12
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -'
  });

  worksheet.cell(1,1).string("Übersicht über alle Bestellungen").style(style);
  worksheet.cell(2,1).string("Bestell-ID").style(style);
  worksheet.cell(2,2).string("Produktbezeichnung").style(style);
  worksheet.cell(2,3).string("Menge").style(style);
  worksheet.cell(2,4).string("Bestelleingang").style(style);
  worksheet.cell(2,5).string("Auslieferdatum").style(style);
  worksheet.cell(2,6).string("Dauer").style(style);
  
  // Aufträge schreiben
  for (var i = 0; i < auftraege.length; i++){
    worksheet.cell(3+i,1).string(auftraege[i].id).style(style);
    worksheet.cell(3+i,2).string(auftraege[i].produktbezeichnung).style(style);
    worksheet.cell(3+i,3).number(auftraege[i].menge).style(style);
    worksheet.cell(3+i,4).date(auftraege[i].startTime).style(style);
    if (tasks[auftraege[i].tasks[auftraege[i].tasks.length-1]].endTime!= null) worksheet.cell(3+i,5).date(tasks[auftraege[i].tasks[auftraege[i].tasks.length-1]].endTime).style(style);
    if (tasks[auftraege[i].tasks[auftraege[i].tasks.length-1]].endTime!= null) worksheet.cell(3+i,6).number(tasks[auftraege[i].tasks[auftraege[i].tasks.length-1]].endTime - auftraege[i].startTime).style(style);
  }


  worksheet2.cell(1,1).string("Übersicht über alle Bestellungen").style(style);
  worksheet2.cell(2,1).string("Bestell-ID").style(style);
  worksheet2.cell(2,2).string("Aufgabenbezeichnung").style(style);
  worksheet2.cell(2,3).string("Bearbeiter").style(style);
  worksheet2.cell(2,4).string("Aufgabenanfang").style(style);
  worksheet2.cell(2,5).string("Aufgabenende").style(style);
  worksheet2.cell(2,6).string("Dauer").style(style);
  // Tasks
  
  for (var i = 0; i < tasks.length; i++){
    if (tasks[i].abgeschlossen== true){
      worksheet2.cell(3+i,1).string(tasks[i].request.id).style(style);
      worksheet2.cell(3+i,2).string(tasks[i].type).style(style);
      worksheet2.cell(3+i,3).string(tasks[i].bearbeiter).style(style);
      worksheet2.cell(3+i,4).date(tasks[i].startTime).style(style);
      if (tasks[i].endTime != null) worksheet2.cell(3+i,5).date(tasks[i].endTime).style(style);
      if (tasks[i].endTime != null) worksheet2.cell(3+i,6).number(tasks[i].endTime - tasks[i].startTime).style(style);      
    }
  }

  // // Set value of cell A1 to 100 as a number type styled with paramaters of style
  // worksheet.cell(1,1).number(100).style(style);

  // // Set value of cell B1 to 300 as a number type styled with paramaters of style
  // worksheet.cell(1,2).number(200).style(style);

  // // Set value of cell C1 to a formula styled with paramaters of style
  // worksheet.cell(1,3).formula('A1 + B1').style(style);

  // // Set value of cell A2 to 'string' styled with paramaters of style
  // worksheet.cell(2,1).string('string').style(style);

  // // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
  // worksheet.cell(3,1).bool(true).style(style).style({font: {size: 14}});

  workbook.write('Excel.xlsx');
}


function convertDate (d_t){
  let year = d_t.getFullYear();
  let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
  let day = ("0" + d_t.getDate()).slice(-2);
  let hour = d_t.getHours();
  let minute = ("0" + (d_t.getMinutes() + 1)).slice(-2);
  let seconds = ("0" + (d_t.getSeconds() + 1)).slice(-2);
  var res = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds;
  return res;
}

function adjustToSimTime (d_t){
  return new Date (startSimTime.getTime() + d_t - simDifference);
  // return new Date (startSimTime.getTime() + (d_t - startSimTime)*timeScale - simDifference);
}

router.route("/data").get(async (req, res) => {
  var result = {};
  var resData = [];
  var resLinks = [];

  // Mode: die Aufträge auf der y Achse anzeigen

  // Untergliederungen:
  // 1. Aufträge:
  var item1 = {}
      item1.id = 1
      item1.text = "Bestellungen"
      item1.start_date = null
      item1.duration =  null
      item1.parent = 0
      item1.progress = 1
      item1.color = "gray"
      resData.push(item1)

  // 1. Aufträge:
  item1 = {}
      item1.id = 2
      item1.text = "Mitarbeiter"
      item1.start_date = null
      item1.duration =  null
      item1.parent = 0
      item1.progress = 1
      item1.color = "gray"
      item1.bar_height= 25
      resData.push(item1)

  // Bestellungen
  var counter = 1;
  for (var i = 0; i < auftraege.length; i++){
      var item = {}
      item.id = resData.length + 1
      item.text = auftraege[i].id
      item.start_date = convertDate(auftraege[i].startTime)
      item.duration =  null
      item.parent = 1
      item.progress = 1
      item1.color = "green"
      resData.push(item)
      counter = resData.length + 1
  }

  // Tasks
  for (var i = 0; i < tasks.length; i++){
    if (tasks[i].abgeschlossen== true){
      var item = {}
      item.id = resData.length + 1
      item.text = tasks[i].type
      item.start_date = convertDate(tasks[i].startTime)
      item.duration =  Math.round((tasks[i].endTime - tasks[i].startTime)/1000/60)
      item.parent = 0
      item.progress = 1
      // find parent:
      for (var j = 2; j < counter-1; j++){
        if (tasks[i].request.id == auftraege[j-2].id){
          var refId = j+1;
          item.parent = refId
        }
      }
      resData.push(item)
    }
  }
  // Jetzt die Zeitachse der Werker zeigen:
  if (tasks.length != 0){
    for (var j = 0; j < workers.length; j++){
        var parentId = resData.length + 1
        var item = {}
        item.id = parentId
        item.text = workers[j].name + " (" + workers[j].verantwortung + ")"
        item.start_date = convertDate(auftraege[0].startTime)
        item.duration =  null
        item.parent = 2
        item.progress = 1
        item.color = "green"
        if (workers[j].tasks.length == 0){          
          item.duration =  Math.round((tasks[0].endTime - tasks[0].startTime)/1000/60)
        }
        resData.push(item)

        for (var i = 0; i < workers[j].tasks.length; i++){
          item = {}
          item.id = resData.length + 1
          item.text = tasks[workers[j].tasks[i]].type;
          item.start_date = convertDate(tasks[workers[j].tasks[i]].startTime)
          item.duration =  Math.round((tasks[workers[j].tasks[i]].endTime - tasks[workers[j].tasks[i]].startTime)/1000/60)
          item.parent = parentId
          item.progress = 1
          resData.push(item)
        }
    }
  }

  result.data = resData
  result.links = resLinks


  res.send (
    result
  );
});

  // {
  //   data: [
  //     {id: 1, text: "Project #1", start_date: null, duration: null, parent:0, progress: 0, color:"red", open: true},
  //     {id: 2, text: "Task #1", start_date: "2019-08-01 00:00:15", duration:5, parent:1, progress: 1},
  //     {id: 3, text: "Task #2", start_date: "2019-08-06 00:30:20", duration:2, parent:1, progress: 0.5},
  //     {id: 4, text: "Task #3", start_date: null, duration: null, parent:1, progress: 0.8, color:"green", open: true},
  //     {id: 5, text: "Task #3.1", start_date: "2019-08-09 12:00:00", duration:2.5, parent:4, progress: 0.2},
  //     {id: 6, text: "Task #3.2", start_date: "2019-08-11 02:00:19", duration:1, parent:4, progress: 0}
  // ],
  // links:[
  //     {id:1, source:2, target:3, type:"0"},
  //     {id:2, source:3, target:4, type:"0"},
  //     {id:3, source:5, target:6, type:"0"}
  // ]
  // }

// use: await sleep (x in ms)
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


module.exports = router;
