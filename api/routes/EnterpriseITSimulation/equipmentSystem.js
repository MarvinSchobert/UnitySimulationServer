const router = require("express").Router();
const { Console } = require("console");
const { TIMEOUT } = require("dns");
const { json } = require("express");
const fs = require('fs');
const { parseXML } = require("jquery");


var equipment = [];

initData("equipment.json", "equipment")

function initData(path, type) {
  try {
    if (fs.existsSync(path)) {
      let rawdata = fs.readFileSync(path);
      let data = JSON.parse(rawdata);

      if (data != null && data.length != 0) {
        if (type == "equipment") {
          equipment = data;
        }
      }
      else {
        pushNewData(type)
      }
    }
    else {
      pushNewData(type)
    }
  } catch (err) {
    console.error(err)
  }
}

function pushNewData(type) {
  if (type == "equipment") {
    equipment.push(
      {
        name: "Werker",
        equipmentId: "E80",
        ruestzeit: 0,
        changeDate: (new Date("2022-12-18T16:53:21.817Z")).toString(),
        revision: 1,
        verantwortlicher: "Schobert",
        dienste: [
          { name: "Geordnetes Speichern", parameter: { "Maximale Kapazität": "150 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Ungeordnetes Speichern", parameter: { "parameter1": 5, "Maximale Traglast": "3500 kg" } },
          { name: "Zusammensetzen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Kleben", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Verschrauben", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Zuteilen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Verzweigen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Zusammenführen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Drehen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Verschieben", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Ordnen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Weitergeben", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Prüfen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Markieren", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Reinigen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Bedrucken", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Abziehen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Informationen weiterleiten", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Informationen verarbeiten", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Informationen speichern", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Informationen eingeben", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } }
        ],
        linie: "LINIE01",
        werk: "MUENCHEN01",
        status: "Serie",
        position: {
          posX: 3.84,
          posY: 0.949,
          posZ: -8.89,
        },
        rotation: {
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          rotW: 1,
        },
        scale: {
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        },
      },
      {
        name: "Lager",
        equipmentId: "E0",
        ruestzeit: 10000,
        changeDate: (new Date("2022-12-18T16:53:21.817Z")).toString(),
        revision: 1,
        verantwortlicher: "Schobert",
        linie: "LINIE01",
        dienste: [
          { name: "Geordnetes Speichern", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Ungeordnetes Speichern", parameter: { "parameter2": 5, "parameter3": 5 } }
        ],
        werk: "MUENCHEN01",
        status: "Serie",
        position: {
          posX: 6.39,
          posY: 0.079,
          posZ: -12.09,
        },
        rotation: {
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          rotW: 1,
        },
        scale: {
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        },
      },
      {
        name: "PCB_Drucker",
        equipmentId: "E10",
        ruestzeit: 10000,
        changeDate: (new Date("2022-12-18T16:53:21.817Z")).toString(),
        revision: 1,
        verantwortlicher: "Schobert",
        linie: "LINIE01",
        dienste: [
          { name: "Bedrucken", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Erwärmen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } }
        ],
        werk: "MUENCHEN01",
        status: "Serie",
        position: {
          posX: 6.39,
          posY: 0.74,
          posZ: -7.54,
        },
        rotation: {
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          rotW: 1,
        },
        scale: {
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        },
      },
      {
        name: "Foerderband",
        equipmentId: "E20",
        ruestzeit: 0,
        changeDate: (new Date("2022-12-18T16:53:21.817Z")).toString(),
        revision: 1,
        verantwortlicher: "Schobert",
        dienste: [
          { name: "Weitergeben", parameter: { "Maximale Kapazität": "150 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Ungeordnetes Speichern", parameter: { "parameter1": 8, "Maximale Traglast": "3500 kg" } },
          { name: "Zusammenführen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Verzweigen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } }
        ],
        linie: "LINIE01",
        werk: "MUENCHEN01",
        status: "Serie",
        position: {
          posX: 6.43,
          posY: 0.49,
          posZ: -5.69,
        },
        rotation: {
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          rotW: 0,
        },
        scale: {
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        },
      },
      {
        name: "Bestuecker",
        equipmentId: "E30",
        ruestzeit: 10000,
        changeDate: (new Date("2022-12-18T16:53:21.817Z")).toString(),
        revision: 1,
        verantwortlicher: "Schobert",
        dienste: [
          { name: "Positionieren", parameter: { "parameter1": 5 } },
          { name: "Zusammensetzen", parameter: { "parameter2": 5 } }
        ],
        linie: "LINIE01",
        werk: "MUENCHEN01",
        status: "Serie",
        position: {
          posX: 6.48,
          posY: 0.78,
          posZ: -3.81,
        },
        rotation: {
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          rotW: 0,
        },
        scale: {
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        },
      },
      {
        name: "Foerderband",
        equipmentId: "E40",
        ruestzeit: 0,
        changeDate: (new Date("2022-12-18T16:53:21.817Z")).toString(),
        revision: 1,
        verantwortlicher: "Schobert",
        dienste: [
          { name: "Weitergeben", parameter: { "Maximale Kapazität": "150 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Ungeordnetes Speichern", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Zusammenführen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Verzweigen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } }
        ],
        linie: "LINIE01",
        werk: "MUENCHEN01",
        status: "Serie",
        position: {
          posX: 6.45,
          posY: 0.49,
          posZ: -1.92,
        },
        rotation: {
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          rotW: 0,
        },
        scale: {
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        },
      },
      {
        name: "Reflow_Ofen",
        equipmentId: "E50",
        ruestzeit: 0,
        changeDate: (new Date("2022-12-18T16:53:21.817Z")).toString(),
        revision: 1,
        verantwortlicher: "Schobert",
        dienste: [
          { name: "Fügen", parameter: { "Maximale Kapazität": "150 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Fügen durch Löten", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Erwärmen", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } }
        ],
        linie: "LINIE01",
        werk: "MUENCHEN01",
        status: "Serie",
        position: {
          posX: 6.36,
          posY: 0.71,
          posZ: 1.5,
        },
        rotation: {
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          rotW: 0,
        },
        scale: {
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        },
      },
      {
        name: "FTF",
        equipmentId: "E60",
        ruestzeit: 0,
        changeDate: (new Date("2022-12-18T16:53:21.817Z")).toString(),
        revision: 1,
        verantwortlicher: "Schobert",
        dienste: [{ name: "Weitergeben", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } }],
        linie: "LINIE01",
        werk: "MUENCHEN01",
        status: "Serie",
        position: {
          posX: 0,
          posY: 0,
          posZ: 0,
        },
        rotation: {
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          rotW: 0,
        },
        scale: {
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        },
      },
      {
        name: "Lager",
        equipmentId: "E70",
        ruestzeit: 0,
        changeDate: (new Date("2022-12-18T16:53:21.817Z")).toString(),
        revision: 1,
        verantwortlicher: "Schobert",
        dienste: [
          { name: "Geordnetes Speichern", parameter: { "Maximale Kapazität": "150 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Ungeordnetes Speichern", parameter: { "Maximale Kapazität": "250 m³", "Maximale Traglast": "3500 kg" } }
        ],
        linie: "LINIE01",
        werk: "MUENCHEN01",
        status: "Serie",
        position: {
          posX: 15,
          posY: 0,
          posZ: 25,
        },
        rotation: {
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          rotW: 0,
        },
        scale: {
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        },
      },
      {
        name: "Roboter",
        equipmentId: "E90",
        ruestzeit: 10,
        changeDate: (new Date("2022-12-18T16:53:21.817Z")).toString(),
        revision: 1,
        verantwortlicher: "Schobert",
        linie: "LINIE01",
        werk: "MUENCHEN01",
        status: "Serie",
        dienste: [
          { name: "Geordnetes Speichern", parameter: { "Maximale Kapazität": "150 m³", "Maximale Traglast": "3500 kg" } },
          { name: "Positionieren", parameter: { "Maximale Positioniergenauigkeit": "1 cm", "Maximale Traglast": "3500 kg" } },
          { name: "Verschieben", parameter: { "Maximale Translationgeschwindigkeit": "2 m/s", "Maximale Traglast": "3500 kg" } },
          { name: "Drehen", parameter: { "Maximale Rotationsgeschwindigkeit": "5 grad/s", "Maximale Traglast": "3500 kg" } },
          { name: "Weitergeben", parameter: { "Maximale Translationgeschwindigkeit": "2 m/s", "Maximale Traglast": "3500 kg" } }
        ],
        position: {
          posX: 4.682,
          posY: 0,
          posZ: -10.88,
        },
        rotation: {
          rotX: 0,
          rotY: 90,
          rotZ: 0,
          rotW: 0,
        },
        scale: {
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        },
      }
    );
  }
}

var servicesTree2 = {
  Dienste: {
    Montageoperationen: {
      Fügen: ["Zusammensetzen", "An- und Einpressen", "Fügen durch Urformen", "Fügen durch Umformen", "Fügen durch Schweißen", "Fügen durch Löten", "Kleben", "Verschrauben"],
      Handhaben: [
        { Speichern: ["Geordnetes Speichern", "Ungeordnetes Speichern"] },
        { MengenVerändern: ["Zuteilen", "Verzweigen", "Zusammenführen"] },
        { Bewegen: ["Drehen", "Verschieben", "Ordnen", "Weitergeben"] },
        { Sichern: ["Positionieren", "Spannen"] },
        { Kontrollieren: ["Prüfen"] }
      ],
      Fertigungsverfahren: ["Urformen", "Umformen", "Trennen", "Fügen", "Beschichten", "Stoffeigenschaften ändern"],
      Sonderoperationen: ["Markieren", "Erwärmen", "Kühlen", "Reinigen", "Entgraten", "Bedrucken", "Abziehen", "Ölen", "Abdichten"],
    },
    Informationstransport: ["Informationen weiterleiten", "Informationen bereitstellen", "Informationen verarbeiten", "Informationen speichern", "Informationen eingeben"]

  }
}

function findPathInNodeTree(target) {
  var currentIdx = -1;
  for (var i = 0; i < m_graph.nodes_input.length; i++) {
    if (m_graph.nodes_input[i].label == target) {
      currentIdx = m_graph.nodes_input[i].id;
      break;
    }
  }
  if (currentIdx == -1) {
    return;
  }
  else {
    var depth = 0;
    var resultIndices = [];
    resultIndices.unshift(currentIdx);
    while (depth < 10) {
      var success = false;
      for (var i = 0; i < m_graph.edges_input.length; i++) {
        if (m_graph.edges_input[i].from == currentIdx) {
          currentIdx = m_graph.edges_input[i].to;
          resultIndices.unshift(currentIdx);
          // console.log(target + ": " + m_graph.nodes_input[currentIdx].label)
          success = true;
          break;
        }
      }
      // Found a root item
      if (!success) {
        break;
      }
    }

    for (var j = 0; j < m_graph.nodes_input.length; j++) {
      for (var i = 0; i < resultIndices.length; i++) {
        if (resultIndices[i].toString() == m_graph.nodes_input[j].id.toString()) {
          if (!isNaN(parseInt(m_graph.nodes_input[j].label.toString()))) {
            resultIndices.splice(i, 1);
          }
          break;
        }
      }
    }
    // console.log("Result: " + resultIndices.toString())
    return resultIndices;
  }
}

router.route("/services/getAll").get(async (req, res) => {
  var services = [];
  for (var i = 0; i < m_graph.nodes_input.length; i++) {
    if (m_graph.nodes_input[i].label.toString() == "Parameter") {
      break;
    }
    else {
      var nr = parseInt(m_graph.nodes_input[i].label.toString());
      if (isNaN(nr)) {
        services.push(m_graph.nodes_input[i].label.toString());
      }
    }
  }
  res.send(services);
});

function renewServicesGraph() {
  graphEntryCounter = 0;
  m_graph =
  {
    nodes_input: [
    ],
    edges_input: [
    ]
  };
  traverseGraph(servicesTree2, -1, 0);
}

router.route("/getSimilarEquipment").post(async (req, res) => {
  var requestServices = req.body.services;
  var nrOfResults = req.body.numberOfResults;
  var result = [];
  for (var i = 0; i < nrOfResults; i++) {
    result.push({});
  }

  // ganzes Equipment absuchen und ähnlichstes Equipment in result schreiben
  for (var i = 0; i < equipment.length; i++) {
    // Compare Services/ Equipment
    var comparison = compareEquipment(requestServices, equipment[i].equipmentId);
    for (var j = 0; j < result.length; j++) {
      if (result[j].similarityScore == null || comparison.similarity_score > result[j].similarityScore) {
        result[j].similarityScore = comparison.similarity_score;
        result[j].overlapScore = comparison.equipment2containsEquipment1_score;
        result[j].overlapServices = comparison.equipment2ContainsEquipment1_services;
        result[j].equipment = equipment[i];
        break;
      }
    }
  }
  // console.log("RESULT: " + JSON.stringify(result));
  res.send({ "response": result });
});

const traverseGraph = (jsonObj, parentId = -1, level, col) => {
  if (jsonObj !== null && typeof jsonObj == "object") {
    Object.entries(jsonObj).forEach(([key, value]) => {
      var i = parseInt(key);
      graphEntryCounter++;
      var itemId = graphEntryCounter;
      if (isNaN(i)) {
        if (col == null) {
          m_graph.nodes_input.push({ id: itemId, value: 35 - (level) * 10, label: key.toString(), title: "Item ID: " + itemId + ", Level: " + level, color: "rgb(51,255,85)" })
        }
        else {
          console.log(key.toString())
          m_graph.nodes_input.push({ id: itemId, value: 35 - (level) * 10, label: key.toString(), title: "Item ID: " + itemId + ", Level: " + level, color: col })
        }
      }
      else {
        if (col == null) {
          m_graph.nodes_input.push({ id: itemId, value: 5, label: key.toString(), title: "Item ID: " + itemId + ", Level: " + level, color: "rgb(51,255,85)" })
        }
        else {
          m_graph.nodes_input.push({ id: itemId, value: 5, label: key.toString(), title: "Item ID: " + itemId + ", Level: " + level, color: col })
        }
      }
      if (parentId != -1) {
        m_graph.edges_input.push({ from: itemId, to: parentId })
      }
      if (isNaN(i)) {
        traverseGraph(value, itemId, level + 1, col);
      }
      else {
        traverseGraph(value, itemId, level, col)
      }
    });
  } else {
    graphEntryCounter++;
    var itemId = graphEntryCounter;

    if (col == null) {
      m_graph.nodes_input.push({ id: itemId, value: 5 - (level + 1) * 5, label: jsonObj.toString(), title: "Item ID: " + itemId + ", Level: " + level, color: "rgb(179,25,255)" })
    }
    else {
      m_graph.nodes_input.push({ id: itemId, value: 5 - (level + 1) * 5, label: jsonObj.toString(), title: "Item ID: " + itemId + ", Level: " + level, color: col })
    }
    if (parentId != -1) {
      m_graph.edges_input.push({ from: itemId, to: parentId })
    }
  }
};


function compareEquipment(services1, equipmentID_2) {
  var equipment2name;
  var services2 = [];
  for (var i = 0; i < equipment.length; i++) {
    if (equipment[i].equipmentId == equipmentID_2) {
      if (equipment[i].dienste != null) {
        services2 = equipment[i].dienste;
        equipment2name = equipment[i].name;
      }
      break;
    }
  }
  var result1 = [];
  var result2 = [];

  for (var i = 0; i < services1.length; i++) {
    var m_r = findPathInNodeTree(services1[i].name);
    services1[i].id = m_r[m_r.length - 1];
    for (var j = 0; j < m_r.length; j++) {
      if (!result1.includes(m_r[j])) result1.push(m_r[j]);
    }
  }
  for (var i = 0; i < services2.length; i++) {
    var m_r = findPathInNodeTree(services2[i].name);
    for (var j = 0; j < m_r.length; j++) {
      if (!result2.includes(m_r[j])) result2.push(m_r[j]);
    }
  }
  var similarityScore = 0.0;
  var equipment1ContainsEquipment2 = 0.0;
  var equipment2ContainsEquipment1 = 0.0;
  var totalLength = result1.length + result2.length;
  var result = {};
  result.similarServices = [];
  result.equipment1ContainsEquipment2_services = [];
  result.equipment2ContainsEquipment1_services = [];
  // Services von 1, die 2 auch kann (Score von 100%: 2 kann alles bzw. mehr, was 1 kann)
  for (var i1 = 0; i1 < result1.length; i1++) {
    if (result2.includes(result1[i1])) {
      // Parameter vergleichen:    
      // Schauen, ob an dem Service Parameter dran hängen:
      var fulfill = 1.0;
      for (var i2 = 0; i2 < services1.length; i2++) {
        if (services1[i2].id.toString() == result1[i1].toString()) {   
          fulfill = 0.0;       
          var parameter1 = services1[i2].parameter;          
          var keys = Object.keys(parameter1);
          for (var j = 0; j < services2.length; j++) {
            if (services2[j].name == services1[i2].name) {
              var parameter2 = services2[j].parameter;
              if (parameter2 == null) parameter2 = {};
              var keys2 = Object.keys(parameter2);
              for (var k = 0; k < keys.length; k++) {
                if (keys2.includes(keys[k])) {
                  // Jetzt herausgefunden, dass der Service dieses Property hat!
                  console.log(equipment2name + " erfüllt Property [" + keys[k] + "] mit Value: " + services2[j].parameter[keys[k]] + " vom Service " + services2[j].name + ". Typ: " + typeof (services2[j].parameter[keys[k]]))
                  fulfill = 1.0/ keys.length;
                  equipment2ContainsEquipment1 += fulfill;
                }
                else {
                  console.log(equipment2name + " erfüllt NICHT Property [" + keys[k] + "]")
                  fulfill = 0.5/ keys.length;
                  equipment2ContainsEquipment1 += fulfill;
                }
              }
              break;
            }
          }
          break;
        }
      }
      similarityScore ++; 
      result.similarServices.push(result1[i1]);
      result.equipment2ContainsEquipment1_services.push(result1[i1]);
    }
  }

  for (var i = 0; i < services1.length; i++) {
    var parameter1 = services1[i].parameter;
    var keys = Object.keys(parameter1);


    // Jetzt schauen, ob Service2 diese Keys enthält
  }

  // Services von 2, die 1 auch kann (Score von 100%: 1 kann alles bzw. mehr, was 2 kann)
  for (var i = 0; i < result2.length; i++) {
    if (result1.includes(result2[i])) {
      // SimilarityScore müsste noch angepasst werden, damit auch die Parameter mit in Betracht gezogen werden
      similarityScore++; equipment1ContainsEquipment2++;
      result.equipment1ContainsEquipment2_services.push(result2[i]);
    }
  }

  result.similarity_score = similarityScore / totalLength;
  result.equipment2containsEquipment1_score = equipment2ContainsEquipment1 / services1.length;
  result.equipment1containsEquipment2_score = equipment1ContainsEquipment2 / result2.length;

  return result;
}


var graphEntryCounter = 0;
var m_graph =
{
  nodes_input: [],
  edges_input: []
}

renewServicesGraph();

router.route("/services/:equipmentID").get(async (req, res) => {
  var m_toColorServices = [];
  for (var i = 0; i < equipment.length; i++) {
    if (equipment[i].equipmentId == req.params.equipmentID.toString()) {
      if (equipment[i].dienste != null) m_toColorServices = equipment[i].dienste;
      break;
    }
  }

  renewServicesGraph();

  for (var i = 0; i < m_toColorServices.length; i++) {
    var result = findPathInNodeTree(m_toColorServices[i].name);
    for (var j = 0; j < m_graph.nodes_input.length; j++) {
      for (var k = 0; k < result.length; k++) {
        if (m_graph.nodes_input[j].id == result[k]) {
          m_graph.nodes_input[j].color = "rgb(255,168,7)";
        }
      }
    }
    traverseGraph(m_toColorServices[i].parameter, result[result.length - 1], result.length, "rgb(255,168,7)");
  }

  // console.log("graph: " + JSON.stringify(m_graph))
  res.render('graphVisualizer',
    m_graph
  );
});

router.route("/").get(async (req, res) => {
  var linien = [];
  for (var i = 0; i < equipment.length; i++) {
    // Linie bereits gespeichert?
    var exists = false;

    for (var j = 0; j < linien.length; j++) {
      if (linien[j].linienName == equipment[i].linie) {
        linien[j].equipment.push(equipment[i]);
        exists = true;
        break;
      }
    }

    if (!exists) {
      var item = {
        linienName: equipment[i].linie,
        werk: equipment[i].werk,
        equipment: [],
      };
      item.equipment.push(equipment[i])
      linien.push(item);
    }
  }
  res.render("equipmentSystem", {
    linien: linien,
  });
});
router.route("/data").get(async (req, res) => {
  var data = [];
  data = equipment;


  res.send(data);
});
router.route("/dataById/:id").get(async (req, res) => {
  var data = {}
  for (var i = 0; i < equipment.length; i++) {
    if (equipment[i].equipmentId == req.params.id) {
      data = equipment[i];
      break;
    }
  }
  console.log("sending the following data: " + JSON.stringify(data));
  res.send(
    {
      "result": data
    }
  );
});


router.route("/data/lines").get(async (req, res) => {
  var linien = [];
  for (var i = 0; i < equipment.length; i++) {
    // Linie bereits gespeichert?
    var exists = false;

    for (var j = 0; j < linien.length; j++) {
      if (linien[j] == equipment[i].linie) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      linien.push(equipment[i].linie);
    }
  }
  res.send(linien);
});

router.route("/data/facilities").get(async (req, res) => {
  var werke = [];
  for (var i = 0; i < equipment.length; i++) {
    // Linie bereits gespeichert?
    var exists = false;

    for (var j = 0; j < werke.length; j++) {
      if (werke[j] == equipment[i].werk) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      werke.push(equipment[i].werk);
    }
  }
  res.send(werke);
});

router.route("/test").post((req, res) => {
  console.log(req.body);
  res.send("Oke");
});

router.route("/changeEquipment").post((req, res) => {
  var equipmentId = req.body.equipmentId;
  var revision = req.body.revision;
  var newEquipmentData = req.body;
  console.log("New Equipment Data change: " + newEquipmentData);
  // Erst gesamtes Equipment durchgehen, ob es dieses Equipment in dieser Revision schon gibt
  var finished = false;
  for (var i = 0; i < equipment.length; i++) {
    if (equipment[i].equipmentId == equipmentId && equipment[i].revision == revision) {
      if (newEquipmentData.changeDate != null) {
        newEquipmentData.changeDate = new Date(newEquipmentData.changeDate);
      }
      // die übermittelten Parameter updaten
      equipment[i].name = newEquipmentData.name ?? equipment[i].name;
      equipment[i].ruestzeit = newEquipmentData.ruestzeit ?? equipment[i].ruestzeit;
      equipment[i].revision = newEquipmentData.revision ?? equipment[i].revision;
      equipment[i].verantwortlicher = newEquipmentData.verantwortlicher ?? equipment[i].verantwortlicher;
      equipment[i].linie = newEquipmentData.linie ?? equipment[i].linie;
      equipment[i].werk = newEquipmentData.werk ?? equipment[i].werk;
      equipment[i].status = newEquipmentData.status ?? equipment[i].status;
      equipment[i].position = newEquipmentData.position ?? equipment[i].position;
      equipment[i].rotation = newEquipmentData.rotation ?? equipment[i].rotation;
      equipment[i].scale = newEquipmentData.scale ?? equipment[i].scale;
      equipment[i].teammitglieder = newEquipmentData.teammitglieder ?? equipment[i].teammitglieder;
      equipment[i].produkte = newEquipmentData.produkte ?? equipment[i].produkte;
      equipment[i].meilensteine = newEquipmentData.meilensteine ?? equipment[i].meilensteine;
      finished = true;
      break;
    }
  }
  if (!finished) {
    newEquipmentData.changeDate = new Date(newEquipmentData.changeDate);
    equipment.push(newEquipmentData);
  }
  res.send(
    {
      "equipmentId": newEquipmentData.equipmentId
    }
  );
});

router.route("/addEquipment").post((req, res) => {
  console.log(req.body);
  var newEquipmentData = {};
  newEquipmentData = req.body;
  if (newEquipmentData.equipmentId == "E0" || newEquipmentData.equipmentId == null) {
    // Neue Equipment-ID finden, 10 Versuche eine zufällige Zahl zu treffen

    for (var i = 0; i < 10; i++) {
      var int = parseInt((Math.random() * 1000), 10) * 10
      newEquipmentData.equipmentId = "E" + int.toString();
      var finished = true;
      for (var j = 0; j < equipment.length; j++) {
        if (equipment[j].equipmentId == newEquipmentData.equipmentId) {
          finished = false;
          break;
        }
      }
      if (finished) {
        break;
      }
    }

  }
  newEquipmentData.changeDate = new Date(newEquipmentData.changeDate);
  equipment.push(newEquipmentData);

  res.send(
    {
      "equipmentId": newEquipmentData.equipmentId
    }
  );

});

module.exports.router = router;
module.exports.equipment = equipment;
