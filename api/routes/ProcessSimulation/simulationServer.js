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
    var id= "bestellung"+Math.floor(Math.random() * 10000);
    var produktbezeichnung = "Fahrrad"
    var menge = 1
    var kunde = "KUN01"
    var lieferAdresse = "Blumenweg 3 Deutschland"
    var lieferDatumSoll = adjustToSimTime(timeCounter + 24*60*60*5).toISOString()
    var bestellDatum = adjustToSimTime(timeCounter).toISOString()

    await producer.send({
      topic: "messageorder",
      messages: [
        {
          key: "Nachricht",
          value: JSON.stringify(
              {"kunde": kunde, 
              "lieferAdresse": lieferAdresse, 
              "lieferDatumSoll": lieferDatumSoll, 
              "produktbezeichnung": produktbezeichnung, 
              "bestellDatum": bestellDatum,
              "menge": menge, 
              "id": id}
            ),
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


const produce = async (topic, data, parameter) => {
	await producer.connect()
  console.log("Sending: " + JSON.stringify(data));
  try {
    await producer.send({
      topic: topic,
      messages: [
        {
          key: "Nachricht",
          value: JSON.stringify({"id": data.id, "simulationRequest":data.simulationRequest, "eventKey":"simulationMessage" ,"Nachricht": parameter}),
        },
      ],
    })
  } catch (err) {
    console.error("could not write message " + err)
  }
	
}

var tasks = [];
var Resources = []; // 
var log = [];
var auftraege = [];

const consume = async () => {
	await consumer.connect()
	await consumer.subscribe({topics: ["message-process"]})
	await consumer.run({ 
		eachMessage:  async ({message}) => {
      console.log("Here" + message.value);
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
      
      // Vertrieb
      if (simulationReq == "bestellungSichten"){       
        task.verantwortung = "Vertrieb"
        if (rnd <30) res = 1;   
        if (rnd > 55) res = 2;  
      }
      else if (simulationReq == "kundePruefen"){        
        task.verantwortung = "Vertrieb"
        if (rnd <60) res = 1;      
      }
      else if (simulationReq == "kundeInCRMSystemAufnehmen"){        
        task.verantwortung = "Vertrieb"
        if (rnd <60) res = 1;      
      }
      else if (simulationReq == "bestellungKlaeren"){        
        task.verantwortung = "Vertrieb"
        if (rnd <60) res = 1;      
      }
      else if (simulationReq == "auftragInERPSystemEintragen"){        
        task.verantwortung = "Vertrieb"
        if (rnd <60) res = 1;      
      }
      else if (simulationReq == "auftragAusERPLoeschen"){        
        task.verantwortung = "Vertrieb"
        if (rnd <60) res = 1;      
      }
      else if (simulationReq == "bestellungDigitalisieren"){
        task.verantwortung = "Vertrieb"               
        if (rnd <50) res = 1;  
      }
      else if (simulationReq == "datenPruefen"){
        task.verantwortung = "Vertrieb"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "mitKundeKlaeren"){
        task.verantwortung = "Vertrieb"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "auftragsbestaetigungSenden"){
        task.verantwortung = "Vertrieb"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "auftragsbestaetigungErstellen"){
        task.verantwortung = "Vertrieb"
        if (rnd <50) res = 1;    
      }      
      else if (simulationReq == "produktionsbedarfErstellen"){
        task.verantwortung = "Vertrieb"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "rechnungStellen"){
        task.verantwortung = "Vertrieb"
        gesamtEinnahmen += 250;        
        if (rnd <50) res = 1;    
      }

      // Produktionsplanung
      else if (simulationReq == "auftragPruefen"){
        task.verantwortung = "Produktionsplanung"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "bedarfPruefen"){
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
        if (rnd <50) res = 1;      
      }
      else if (simulationReq == "stuecklisteBetrachten"){
        task.verantwortung = "Produktionsplanung"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "bedarfNachbearbeiten"){
        task.verantwortung = "Produktionsplanung"
        if (rnd <40) res = 1;      
        else if (rnd <70) res = 2;  
      }
      else if (simulationReq == "rohmaterialVerfuegbarkeitPruefen"){
        task.verantwortung = "Produktionsplanung"
        if (rnd <50) res = 1;      
      }
      else if (simulationReq == "problemBeschreiben"){
        task.verantwortung = "Produktionsplanung"
        if (rnd <50) res = 1;      
      }
      else if (simulationReq == "produktionsauftragErstellen"){
        task.verantwortung = "Produktionsplanung"
        if (rnd <40) res = 1;      
        else if (rnd <70) res = 2;  
      }
      else if (simulationReq == "materialbedarfErstellen"){
        task.verantwortung = "Produktionsplanung"
        if (rnd <50) res = 1;      
      }
      else if (simulationReq == "materialbedarfUebermitteln"){
        task.verantwortung = "Produktionsplanung"
        if (rnd <50) res = 1;      
      }

      // Einkauf
      else if (simulationReq == "materialbedarfPruefen"){
        task.verantwortung = "Einkauf"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "lieferantenAussuchen"){
        task.verantwortung = "Einkauf"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "materialBestellen"){
        task.verantwortung = "Einkauf"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "lieferantAnfragenUndPruefen"){
        task.verantwortung = "Einkauf"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "vermerkImSCMSystemVornehmen"){
        task.verantwortung = "Einkauf"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "problemBeschreiben"){
        task.verantwortung = "Einkauf"
        if (rnd <50) res = 1;      
      }

       // Finanzwesen
       else if (simulationReq == "rechnungErstellen"){
        task.verantwortung = "Finanz"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "gewinnVerbuchen"){
        task.verantwortung = "Finanz"
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
      else if (simulationReq == "auftragEintragen"){
        task.verantwortung = "Logistik"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "lieferungEinlagern"){
        task.verantwortung = "Logistik"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "auftragEintragen"){
        task.verantwortung = "Logistik"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "produktentnahmeEintragen"){
        task.verantwortung = "Logistik"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "liefern"){
        task.verantwortung = "Logistik"
        if (rnd <50) res = 1;    
      }

       // Produktion
      else if (simulationReq == "materialEntnehmen"){
        task.verantwortung = "Produktionsmitarbeiter"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "kommissionieren"){
        task.verantwortung = "Produktionsmitarbeiter"
        if (rnd <50) res = 1;    
      }
      else if (simulationReq == "eintragen"){
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
     
     
      
      if (request.verantwortung != null && request.verantwortung != "")
      {
        task.verantwortung = request.verantwortung
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

  const firstnames = ["Andrew", "Ryan", "Joshua", "Justin", "Brandon", "John", "Roberto", "Travis", "Alexander", "Andreas", "Frank", "Martin"]
  const lastnames = [ "Aguilar", "Schwartz" ,"Gonzalez","Butler","Garcia","Torres","Brown","Hill","Brown","Spector","Brandt", "Müller", "Schubert"]

  for (var i = 0; i < 1; i++){
    var resource = {}
    resource.aktuelleAufgabe = -1
    resource.verantwortung = "Vertrieb"
    resource.tasks = []
    resource.name = firstnames [Math.floor(Math.random() * firstnames.length)] + " " + lastnames [Math.floor(Math.random() * lastnames.length)]
    resource.gehaltprojahr = 65000
    resource.arbeitszeitprojahr_minuten = 90000
    Resources.push(resource)    
  }
  for (var i = 0; i < 1; i++){
    var resource = {}
    resource.aktuelleAufgabe = -1
    resource.verantwortung = "Produktionsplanung"
    resource.tasks = []
    resource.name = firstnames [Math.floor(Math.random() * firstnames.length)] + " " + lastnames [Math.floor(Math.random() * lastnames.length)]
    resource.gehaltprojahr = 80000
    resource.arbeitszeitprojahr_minuten = 90000
    Resources.push(resource)    
  }
  for (var i = 0; i < 1; i++){
    var resource = {}
    resource.aktuelleAufgabe = -1
    resource.verantwortung = "Logistik"
    resource.tasks = []
    resource.name = firstnames [Math.floor(Math.random() * firstnames.length)] + " " + lastnames [Math.floor(Math.random() * lastnames.length)]
    resource.gehaltprojahr = 45000
    resource.arbeitszeitprojahr_minuten = 100000
    Resources.push(resource)    
  }
  for (var i = 0; i < 1; i++){
    var resource = {}
    resource.aktuelleAufgabe = -1
    resource.verantwortung = "Produktionsmitarbeiter"
    resource.tasks = []
    resource.name = firstnames [Math.floor(Math.random() * firstnames.length)] + " " + lastnames [Math.floor(Math.random() * lastnames.length)]
    resource.gehaltprojahr = 45000
    resource.arbeitszeitprojahr_minuten = 100000
    Resources.push(resource)    
  }
  for (var i = 0; i < 1; i++){
    var resource = {}
    resource.aktuelleAufgabe = -1
    resource.verantwortung = "Einkauf"
    resource.tasks = []
    resource.name = firstnames [Math.floor(Math.random() * firstnames.length)] + " " + lastnames [Math.floor(Math.random() * lastnames.length)]
    resource.gehaltprojahr = 80000
    resource.arbeitszeitprojahr_minuten = 90000
    Resources.push(resource)    
  }
  for (var i = 0; i < 1; i++){
    var resource = {}
    resource.aktuelleAufgabe = -1
    resource.verantwortung = "Finanz"
    resource.tasks = []
    resource.name = firstnames [Math.floor(Math.random() * firstnames.length)] + " " + lastnames [Math.floor(Math.random() * lastnames.length)]
    resource.gehaltprojahr = 80000
    resource.arbeitszeitprojahr_minuten = 90000
    Resources.push(resource)    
  }
  for (var i = 0; i < 1; i++){
    var resource = {}
    resource.aktuelleAufgabe = -1
    resource.verantwortung = "Maschine"
    resource.tasks = []
    resource.name = "Maschine " + i;
    resource.gehaltprojahr = 20000
    resource.arbeitszeitprojahr_minuten = 525600
    Resources.push(resource)    
  }
  for (var i = 0; i < 1; i++){
    var resource = {}
    resource.aktuelleAufgabe = -1
    resource.verantwortung = "Förderband"
    resource.tasks = []
    resource.name = "Förderband " + i;
    resource.gehaltprojahr = 5000
    resource.arbeitszeitprojahr_minuten = 525600
    Resources.push(resource)    
  }

  while (!restartSim){
    
    // ggf. zufällig Bestellung tätigen:
    if (bestellungenQueue > 0 && Math.random()*100>98){
      await bestellungAufgeben();
      bestellungenQueue--;
    }
    var simActive = false;
    Resources.forEach( (resource) => {
      // Neuen Task nehmen
      if (resource.aktuelleAufgabe == -1){
        for (var j = 0; j < tasks.length; j++){
          if (!tasks[j].abgeschlossen && tasks[j].aktuellBearbeitet == false && resource.verantwortung == tasks[j].verantwortung)
          {
            // Auswahl überlegen bzgl. Umrüstzeit etc.
            if (resource.tasks.length != 0 && tasks[j].request.simulationRequest != tasks[ resource.tasks[resource.tasks.length-1]].request.simulationRequest){
              // Sozusagen Umrüstzeit bei der Aufgabenbearbeitung
              tasks[j].remainingTime = Math.floor(tasks[j].remainingTime*1)
            }
            
            // Aufgabe auswählen
            store (tasks[j].request.id, tasks[j].storeText + " begonnen", true)
            tasks[j].aktuellBearbeitet = true
            tasks[j].startTime = adjustToSimTime(timeCounter)
            tasks[j].bearbeiter = resource.name
            resource.aktuelleAufgabe = j
            resource.tasks.push (j)
            simActive = true;
            tasks[j].canComplete = true;
            break;
          }
        }
      }
      // Aufgabe bearbeiten
      else {
        // var time_hour = Date.now().getHours 
        // if (time_hour < 18 && time_hour > 8)
        // tasks[resource.aktuelleAufgabe].remainingTime -= 10 * timeScale //Milliseconds
        simActive = true;

          // Aufgabe abgeschlossen
          if (tasks[resource.aktuelleAufgabe].canComplete && (adjustToSimTime(timeCounter) - tasks[resource.aktuelleAufgabe].startTime) >= tasks[resource.aktuelleAufgabe].remainingTime){
           

            produce("messageservices", tasks[resource.aktuelleAufgabe].request, {res: tasks[resource.aktuelleAufgabe].res}).catch((err) => {
              console.error("error in consumer: ", err)
            })
            store (tasks[resource.aktuelleAufgabe].request.id, tasks[resource.aktuelleAufgabe].storeText + " fertig", true)
            tasks[resource.aktuelleAufgabe].abgeschlossen = true;
            tasks[resource.aktuelleAufgabe].endTime = adjustToSimTime(timeCounter)
            // Kosten der Aufgabe bestimmen
            tasks[resource.aktuelleAufgabe].kosten = resource.gehaltprojahr / resource.arbeitszeitprojahr_minuten * ((tasks[resource.aktuelleAufgabe].endTime - tasks[resource.aktuelleAufgabe].startTime)/1000/60)
            resource.aktuelleAufgabe = -1;           
            // console.log("resource available again.");  
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
  Resources = [];
  log = [];
  simDifference = 0;
  routine();
 
}

routine();


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
        var time = 0
        if(auftraege[i].tasks.length > 0 && tasks[auftraege[i].tasks[auftraege[i].tasks.length-1]].endTime!= null){
          time = tasks[auftraege[i].tasks[auftraege[i].tasks.length-1]].endTime - auftraege[i].startTime
        }
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
      var time = 0
      if(auftraege[i].tasks.length > 0 && tasks[auftraege[i].tasks[auftraege[i].tasks.length-1]].endTime!= null){
        time = tasks[auftraege[i].tasks[auftraege[i].tasks.length-1]].endTime - auftraege[i].startTime
      }
      obj.totalTime = time
      processVariants.push(obj);
    }
  }

  // Auslastungen finden:
  if (auftraege.length != 0){
    var completeSimTime = getEndOfSimTime() - auftraege[0].startTime
    console.log("Complete Sim: " + completeSimTime / 1000 / 60 + " min")   
    for (var i = 0; i < Resources.length; i++){
      var obj = {}
      obj.name = Resources[i].name
      obj.workingTime = 0
      for (var t = 0; t < Resources[i].tasks.length; t++){
        obj.workingTime += (tasks[Resources[i].tasks[t]].endTime - tasks[Resources[i].tasks[t]].startTime)
      }
      obj.completeSimTime = completeSimTime;
      obj.wertschöpfung = obj.workingTime/1000/60 * Resources[i].gehaltprojahr/ Resources[i].arbeitszeitprojahr_minuten;
      obj.bezahlung = completeSimTime/1000/60 * Resources[i].gehaltprojahr/ Resources[i].arbeitszeitprojahr_minuten;
      obj.abteilung = Resources[i].verantwortung
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
    }// ,
    // numberFormat: '$#,##0.00; ($#,##0.00); -'
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
    if (auftraege[i].tasks.length > 0 && tasks[auftraege[i].tasks[auftraege[i].tasks.length-1]].endTime!= null) worksheet.cell(3+i,5).date(tasks[auftraege[i].tasks[auftraege[i].tasks.length-1]].endTime).style(style);
    if (auftraege[i].tasks.length > 0 && tasks[auftraege[i].tasks[auftraege[i].tasks.length-1]].endTime!= null) worksheet.cell(3+i,6).number((tasks[auftraege[i].tasks[auftraege[i].tasks.length-1]].endTime - auftraege[i].startTime)/1000).style(style);
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
      if (tasks[i].endTime != null) worksheet2.cell(3+i,6).number((tasks[i].endTime - tasks[i].startTime)/1000).style(style);      
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
    for (var j = 0; j < Resources.length; j++){
        var parentId = resData.length + 1
        var item = {}
        item.id = parentId
        item.text = Resources[j].name + " (" + Resources[j].verantwortung + ")"
        item.start_date = convertDate(auftraege[0].startTime)
        item.duration =  null
        item.parent = 2
        item.progress = 1
        item.color = "green"
        if (Resources[j].tasks.length == 0){          
          item.duration =  Math.round((tasks[0].endTime - tasks[0].startTime)/1000/60)
        }
        resData.push(item)

        for (var i = 0; i < Resources[j].tasks.length; i++){
          item = {}
          item.id = resData.length + 1
          item.text = tasks[Resources[j].tasks[i]].type;
          item.start_date = convertDate(tasks[Resources[j].tasks[i]].startTime)
          item.duration =  Math.round((tasks[Resources[j].tasks[i]].endTime - tasks[Resources[j].tasks[i]].startTime)/1000/60)
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
