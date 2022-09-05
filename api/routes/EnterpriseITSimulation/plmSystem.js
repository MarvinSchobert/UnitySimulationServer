const router = require("express").Router();
const fs = require('fs');

var ebomData = [];
//
//
//
//
//
//
//
//
initData("EBOM.json");
// Es wird ebomData aus der Datenbank gelesen, wenn Einträge vorhanden sind, diese nehmen, ansonsten generischen Inhalt einfüllen
function initData (path){  
  try {
    if (fs.existsSync(path)) {
      let rawdata = fs.readFileSync(path);
      let data= JSON.parse(rawdata);

      if (data != null && data.length != 0){
        ebomData = data;
      }
      else {
        pushNewData()
      }
    }
    else {
      pushNewData()
    }
  } catch(err) {
    console.error(err)
  }  
}

function pushNewData (){
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
  if (obj != null){
    for (var i = 0; i < obj.children.length; i++) {
      if (itemName != "" && obj.children[i].name == itemName || itemId != "" &&  obj.children[i].id == itemId) {
        return obj.children[i];
      } else {
        var res = findInChildren(obj.children[i], itemName);
        if (res != null) return res;
      }
    }
  }
  else {
    for (var j = 0; j < ebomData.length; j++){
      obj = ebomData[j];
      if (itemName != "" && obj.name == itemName || itemId != "" &&  obj.id == itemId) {
        return obj;
      }
      for (var i = 0; i < obj.children.length; i++) {
        if (itemName != "" && obj.children[i].name == itemName || itemId != "" &&  obj.children[i].id == itemId) {
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

  for (var i = 0; i < ebomData.length; i++) {
    if (req.params.itemName == ebomData[i].name) {
      result.BOM.push(ebomData[i]);
      break;
    } else {
      result.BOM.push(findInChildren(ebomData[i], req.params.itemName));
    }
  }
  res.send(result);
});

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
  if (parent.children != null){
    parent.children.push(newItem);
  }
  res.redirect("/plmSystem");
});

router.route("/removeItem").post((req, res) => {
  var id = req.body.itemId;
  var parentId = req.body.parentId;
  
  var parent = findInChildren(null, "", parentId);
  for (var i = 0; i < parent.children.length; i++){
    if (parent.children[i].id == id){
      parent.children.splice(i,1);
      break;
    }
  }

  res.redirect("/plmSystem");
});

router.route("/changeItem").post((req, res) => {
  var id = req.body.itemId;
  
  var obj = findInChildren(null, "", id);
  console.log (req.body + ", \n" + obj);
  if (req.body.newItemName != ""){obj.name = req.body.newItemName }
  if (req.body.newItemId != ""){obj.id = req.body.newItemId}
  if (req.body.newProduktTyp != ""){obj.produktTyp = req.body.newProduktTyp}
  if (req.body.newParentId != "" && req.body.oldParentId != ""){
    var parent = findInChildren(null, "", req.body.oldParentId);
    for (var i = 0; i < parent.children.length; i++){
      if (parent.children[i].id == id){
        parent.children.splice(i,1);
        break;
      }
    }
    parent = findInChildren(null, "", req.body.newParentId);
    parent.children.push (obj);
  }
  

  res.redirect("/plmSystem");
});

module.exports = router;
