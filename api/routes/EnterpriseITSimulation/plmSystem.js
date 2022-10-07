const router = require("express").Router();
const { TIMEOUT } = require("dns");
const fs = require('fs');

var ebomData = [];
var ebomData2 = [];
// ein Objekt:
// {
//       auftragsId: String, // eine eindeutige ID
//       auftragsTyp: String, // der Auftragstyp, bspw. "Bestellung", "umlagerung", "Produktionsauftrag"
//       itemId: String, // Stammdaten-ID des entsprechenden Materialstamms
//       itemAnzahl: int, // Wie viel Material betrifft das?
//       lagerortId: String, // welches Lager betrifft das alles
// }


initData("EBOM.json");
pushNewData2();
// Es wird ebomData aus der Datenbank gelesen, wenn Einträge vorhanden sind, diese nehmen, ansonsten generischen Inhalt einfüllen
function initData(path) {
  try {
    
    if (fs.existsSync(path)) {
      let rawdata = fs.readFileSync(path);
      let data = JSON.parse(rawdata);

      if (data != null && data.length != 0) {
        ebomData = data;
      }
      else {
        pushNewData()
      }
    }
    else {
      pushNewData()
    }
  } catch (err) {
    console.error(err)
  }
  
}
function pushNewData2() {
  ebomData2.push(
    {
      id: "MAT01",
      materialId: "MAT01",
      name: "Fahrrad",
      produktTyp: "Fertigerzeugnis",
      relativePosition: {
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      relativeRotation: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        rotW: 0,
      },
      parent: "",
      children: ["MAT02", "MAT051", "MAT052"]
    },
    {
      id: "MAT02",
      materialId: "MAT02",
      name: "ZSB_Rahmen",
      produktTyp: "Halberzeugnis",
      relativePosition: {
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      relativeRotation: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        rotW: 0,
      },
      parent: "MAT01",
      children: ["MAT03", "MAT0411", "MAT042", "MAT043", "MAT044"]
    },
    {
      id: "MAT03",
      materialId: "MAT03",
      name: "Rahmen",
      produktTyp: "Rohmaterial",
      relativePosition: {
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      relativeRotation: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        rotW: 0,
      },
      parent: "MAT02",
      children: []
    },
    {
      id: "MAT0411",
      materialId: "MAT041",
      name: "Pedal",
      produktTyp: "Rohmaterial",
      relativePosition: {
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      relativeRotation: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        rotW: 0,
      },
      parent: "MAT02",
      children: []
    },
    {
      id: "MAT0412",
      materialId: "MAT041",
      name: "Pedal",
      produktTyp: "Rohmaterial",
      relativePosition: {
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      relativeRotation: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        rotW: 0,
      },
      parent: "MAT02",
      children: []
    },
    {
      id: "MAT042",
      materialId: "MAT042",
      name: "Bremse",
      produktTyp: "Rohmaterial",
      relativePosition: {
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      relativeRotation: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        rotW: 0,
      },
      parent: "MAT02",
      children: [],
    },
    {
      id: "MAT043",
      materialId: "MAT043",
      name: "Gangschaltung",
      produktTyp: "Rohmaterial",
      relativePosition: {
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      relativeRotation: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        rotW: 0,
      },
      parent: "MAT02",
      children: [],
    },
    {
      id: "MAT044",
      materialId: "MAT044",
      name: "Lenker",
      produktTyp: "Rohmaterial",
      relativePosition: {
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      relativeRotation: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        rotW: 0,
      },
      parent: "MAT02",
      children: [],
    },
    {
      id: "MAT051",
      materialId: "MAT05",
      name: "Reifen",
      produktTyp: "Rohmaterial",
      relativePosition: {
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      relativeRotation: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        rotW: 0,
      },
      parent: "MAT01",
      children: [],
    },
    {
      id: "MAT052",
      materialId: "MAT05",
      name: "Reifen",
      produktTyp: "Rohmaterial",
      relativePosition: {
        posX: 0,
        posY: 0,
        posZ: 0,
      },
      relativeRotation: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        rotW: 0,
      },
      parent: "MAT01",
      children: [],
    }
  );
}
function pushNewData() {
  ebomData.push({
    id: "MAT01",
    materialId: "MAT01",
    name: "Fahrrad",
    produktTyp: "Fertigerzeugnis",
    relativePosition: {
      posX: 0,
      posY: 0,
      posZ: 0,
    },
    relativeRotation: {
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      rotW: 0,
    },
    children: [
      {
        id: "MAT02",
        materialId: "MAT02",
        name: "ZSB_Rahmen",
        produktTyp: "Halberzeugnis",
        relativePosition: {
          posX: 0,
          posY: 0,
          posZ: 0,
        },
        relativeRotation: {
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          rotW: 0,
        },
        children: [
          {
            id: "MAT03",
            materialId: "MAT03",
            name: "Rahmen",
            produktTyp: "Rohmaterial",
            relativePosition: {
              posX: 0,
              posY: 0,
              posZ: 0,
            },
            relativeRotation: {
              rotX: 0,
              rotY: 0,
              rotZ: 0,
              rotW: 0,
            },
            children: [],
          },
          {
            id: "MAT0411",
            materialId: "MAT041",
            name: "Pedal",
            produktTyp: "Rohmaterial",
            relativePosition: {
              posX: 0,
              posY: 0,
              posZ: 0,
            },
            relativeRotation: {
              rotX: 0,
              rotY: 0,
              rotZ: 0,
              rotW: 0,
            },
            children: [],
          },
          {
            id: "MAT0412",
            materialId: "MAT041",
            name: "Pedal",
            produktTyp: "Rohmaterial",
            relativePosition: {
              posX: 0,
              posY: 0,
              posZ: 0,
            },
            relativeRotation: {
              rotX: 0,
              rotY: 0,
              rotZ: 0,
              rotW: 0,
            },
            children: [],
          },
          {
            id: "MAT042",
            materialId: "MAT042",
            name: "Bremse",
            produktTyp: "Rohmaterial",
            relativePosition: {
              posX: 0,
              posY: 0,
              posZ: 0,
            },
            relativeRotation: {
              rotX: 0,
              rotY: 0,
              rotZ: 0,
              rotW: 0,
            },
            children: [],
          },
          {
            id: "MAT043",
            materialId: "MAT043",
            name: "Gangschaltung",
            produktTyp: "Rohmaterial",
            relativePosition: {
              posX: 0,
              posY: 0,
              posZ: 0,
            },
            relativeRotation: {
              rotX: 0,
              rotY: 0,
              rotZ: 0,
              rotW: 0,
            },
            children: [],
          },
          {
            id: "MAT044",
            materialId: "MAT044",
            name: "Lenker",
            produktTyp: "Rohmaterial",
            relativePosition: {
              posX: 0,
              posY: 0,
              posZ: 0,
            },
            relativeRotation: {
              rotX: 0,
              rotY: 0,
              rotZ: 0,
              rotW: 0,
            },
            children: [],
          },
        ],
      },
      {
        id: "MAT051",
        materialId: "MAT05",
        name: "Reifen",
        produktTyp: "Rohmaterial",
        relativePosition: {
          posX: 0,
          posY: 0,
          posZ: 0,
        },
        relativeRotation: {
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          rotW: 0,
        },
        children: [],
      },
      {
        id: "MAT052",
        materialId: "MAT05",
        name: "Reifen",
        produktTyp: "Rohmaterial",
        relativePosition: {
          posX: 0,
          posY: 0,
          posZ: 0,
        },
        relativeRotation: {
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          rotW: 0,
        },
        children: [],
      },
    ],
  });
}

router.route("/").get(async (req, res) => {
  res.render("plmSystem", {
    bom: ebomData,
  });
});

function findInChildren(obj, itemName, itemId) {
  if (obj != null) {
    for (var i = 0; i < obj.children.length; i++) {
      if (itemName != "" && obj.children[i].name == itemName || itemId != "" && obj.children[i].id == itemId) {
        return obj.children[i];
      } else {
        var res = findInChildren(obj.children[i], itemName);
        if (res != null) return res;
      }
    }
  }
  else {
    for (var j = 0; j < ebomData.length; j++) {
      obj = ebomData[j];
      if (itemName != "" && obj.name == itemName || itemId != "" && obj.id == itemId) {
        return obj;
      }
      for (var i = 0; i < obj.children.length; i++) {
        if (itemName != "" && obj.children[i].name == itemName || itemId != "" && obj.children[i].id == itemId) {
          return obj.children[i];
        } else {
          var res = findInChildren(obj.children[i], itemName);
          if (res != null) return res;
        }
      }
    }
  }
}


router.route("/getEBOM/:itemName").get(async (req, res) => {
  var result = {};
  result.BOM = [];
  for (var i = 0; i < ebomData2.length; i++) { 
    if (ebomData2[i].name == req.params.itemName){
      traverseBOM (i, result);
      break;
    }
  }
  res.send(result);
});

router.route("/getMBOM/:itemName").get(async (req, res) => {
  var result = {};
  result.BOM = [];
  var temp = {};
  temp.BOM = [];
  for (var i = 0; i < ebomData2.length; i++) { 
    if (ebomData2[i].name == req.params.itemName){
      traverseBOM (i, temp);
      break;
    }
  }

  for (var i = 0; i < temp.BOM.length; i++){
    var alreadyInResult = false;
    for (var j = 0; j < result.BOM.length; j++){
      if (temp.BOM[i].materialId == result.BOM[j].materialId && temp.BOM[i].name != req.params.itemName){
        result.BOM[j].amount++;
        alreadyInResult = true;
        break;
      }      
    }
    if (!alreadyInResult && temp.BOM[i].name != req.params.itemName){
      result.BOM.push( 
        { 
          materialId: temp.BOM[i].materialId,        
          name: temp.BOM[i].name,
          produktTyp: temp.BOM[i].produktTyp,
          amount: 1
        });
    }
  }
  res.send(result);
});

router.route("/getMBOM_hl/:itemName").get(async (req, res) => {
  var result = {};
  result.BOM = [];
  var temp = {};
  temp.BOM = [];
  for (var i = 0; i < ebomData2.length; i++) { 
    if (ebomData2[i].name == req.params.itemName){
      for (var j = 0; j < ebomData2[i].children.length; j++){    
        for (var k = 0; k < ebomData2.length; k++){
          if (ebomData2[k].id.toString() == ebomData2[i].children[j].toString()){
            temp.BOM.push(ebomData2[k]);
            break;
          }
        }
      }

      break;
    }
  }
  

  for (var i = 0; i < temp.BOM.length; i++){
    var alreadyInResult = false;
    for (var j = 0; j < result.BOM.length; j++){
      if (temp.BOM[i].materialId == result.BOM[j].materialId){
        result.BOM[j].amount++;
        alreadyInResult = true;
        break;
      }      
    }
    if (!alreadyInResult){
      result.BOM.push( 
        { 
          materialId: temp.BOM[i].materialId,        
          name: temp.BOM[i].name,
          produktTyp: temp.BOM[i].produktTyp,
          amount: 1
        });
    }
  }
  res.send(result);
});


function traverseBOM (currentProdIdx, result){  
  // process current node
  result.BOM.push (ebomData2[currentProdIdx]);

  // traverse children
  for (var i = 0; i < ebomData2[currentProdIdx].children.length; i++){    
    var nextIdx = -1;
    for (var j = 0; j < ebomData2.length; j++){
      if (ebomData2[j].id.toString() == ebomData2[currentProdIdx].children[i].toString()){
        nextIdx = j;
        break;
      }
    }
    if (nextIdx != -1){
      traverseBOM (nextIdx, result)
    }    
  }
}


router.route("/saveData").post((req, res) => {
  try {
    fs.writeFileSync("EBOM.json", JSON.stringify(ebomData));
    console.log("EBOM.json has been saved with the user data");
  } catch (err) {
    console.error(err);
  }
  res.redirect("/");
});

router.route("/addItem").post((req, res) => {
  var matId = req.body.itemId;
  if (req.body.materialId != null) matId = req.body.materialId;
  var newItem = {
    id: req.body.itemId,
    materialId: req.body.matId,
    name: req.body.itemName,
    produktTyp: req.body.produktTyp,
    relativePosition: {
      posX: 0,
      posY: 0,
      posZ: 0,
    },
    relativeRotation: {
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      rotW: 0,
    },
    children: []
  }
  var parent = findInChildren(null, "", req.body.parentId);
  if (parent.children != null) {
    parent.children.push(newItem);
  }
  res.redirect("/plmSystem");
});

router.route("/removeItem").post((req, res) => {
  var id = req.body.itemId;
  var parentId = req.body.parentId;

  var parent = findInChildren(null, "", parentId);
  for (var i = 0; i < parent.children.length; i++) {
    if (parent.children[i].id == id) {
      parent.children.splice(i, 1);
      break;
    }
  }

  res.redirect("/plmSystem");
});

router.route("/changeItem").post((req, res) => {
  var id = req.body.itemId;

  var obj = findInChildren(null, "", id);
  console.log(req.body + ", \n" + obj);
  if (req.body.newItemName != "") { obj.name = req.body.newItemName }
  if (req.body.newItemId != "") { obj.id = req.body.newItemId }
  if (req.body.newProduktTyp != "") { obj.produktTyp = req.body.newProduktTyp }
  if (req.body.newParentId != "" && req.body.oldParentId != "") {
    var parent = findInChildren(null, "", req.body.oldParentId);
    for (var i = 0; i < parent.children.length; i++) {
      if (parent.children[i].id == id) {
        parent.children.splice(i, 1);
        break;
      }
    }
    parent = findInChildren(null, "", req.body.newParentId);
    parent.children.push(obj);
  }


  res.redirect("/plmSystem");
});

module.exports = router;
