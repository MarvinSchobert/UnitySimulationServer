const router = require("express").Router();
const { TIMEOUT } = require("dns");
const fs = require('fs');

var equipment = [];

initData ("equipment.json", "equipment")
// ein Objekt:
// {
//   name: String, // Name des Equipments
//   equipmentId: String, // ID des Equipments
//   ruestzeit: float, // Rüstzeit in MS
//   changeDate: String, // Datum des Changes
//   revision: int, // Revisionsnummer
//   status: string, // planung, musterbau, serie
//   position: {
//    posX: 0,
//    posY: 0,
//    posZ: 0,
//  },
//  rotation: {
//    rotX: 0,
//    rotY: 0,
//    rotZ: 0,
//    rotW: 0,
//  },
//  scale: {
//    scaleX: 1,
//    scaleY: 1,
//    scaleZ: 1,
//  },
// }



function initData (path, type){  
  try {
    if (fs.existsSync(path)) {
      let rawdata = fs.readFileSync(path);
      let data= JSON.parse(rawdata);

      if (data != null && data.length != 0){
        if (type == "equipment"){
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
  } catch(err) {
    console.error(err)
  }  
}

function pushNewData (type){
  if (type == "equipment"){
    equipment.push(
      {
        name: "Werker",
        equipmentId: "E80",
        ruestzeit: 0,
        changeDate: (new Date("2022-12-18T16:53:21.817Z")).toString(),
        revision: 1,
        verantwortlicher: "Schobert",
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
      }
    );
  }
}

router.route("/").get(async (req, res) => {
  var linien = [];
  for (var i = 0; i < equipment.length; i++){
    // Linie bereits gespeichert?
    var exists = false;
  
    for (var j = 0; j < linien.length; j++){      
      if (linien[j].linienName == equipment[i].linie){
        linien[j].equipment.push(equipment[i]);
        exists = true;
        break;
      }
    }

    if (!exists){
      var item  = {
        linienName: equipment[i].linie,
        werk: equipment[i].werk,
        equipment: [],
      };
      item.equipment.push(equipment[i])
      linien.push (item);
    }
  }
  res.render("equipmentSystem", {
      linien: linien,
    });
});
router.route("/data").get(async (req, res) => {
  var data = [];
  data = equipment;


  res.send (data);
});
router.route("/changeEquipment").post((req, res) => {
    var equipmentId = req.body.equipmentId;
    var revision = req.body.revision;
    var newEquipmentData = req.body.newData;
    
    for (var i = 0; i < equipment.length; i++){
      if (equipment[i].equipmentId == equipmentId && equipment[i].revision == revision){
        equipment[i] = newEquipmentData;
        break;
      }
    }
    res.send ("updated equipment successfully")
});

router.route("/addEquipment").post((req, res) => {
  var newEquipmentData = req.body.newData;
  
  equipment.push (newEquipmentData);

  res.send ("added equipment successfully")
});

module.exports.router = router;
module.exports.equipment = equipment;
