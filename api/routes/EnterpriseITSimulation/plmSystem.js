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


var productionTaskStammdaten = [];
// ein Objekt:
// {
//       taskId: String, // eine eindeutige ID
//       processName: String, // der Prozesstyp (bspw. Zuführen, Drucken, Transportieren...)
//       resources: [ // Instanz-ID des entsprechenden Equipments//        
//          resourceId: String        
//       ],
//       inputProducts: [ itemId: String ], // Stammdaten-ID des Produkts
//       outputProducts: [ itemId: String ], // Stammdaten-ID des Produkts
// }




initData("EBOM.json", "ebom");
initData("ProductionProcess.json", "process");
// pushNewData2();
// Es wird ebomData aus der Datenbank gelesen, wenn Einträge vorhanden sind, diese nehmen, ansonsten generischen Inhalt einfüllen
function initData(path, type) {
  try {
    
    if (fs.existsSync(path)) {
      let rawdata = fs.readFileSync(path);
      let data = JSON.parse(rawdata);

      if (data != null && data.length != 0) {
        if (type == "ebom"){
          ebomData = data;
        }
        else if (type == "process"){
          productionProcessData = data;
        }
        
      }
      else {
        if (type == "ebom"){
          pushEBOM()
        }
        else if (type == "process"){
          pushProcessData()
        }
      }
    }
    else {
      if (type == "ebom"){
        pushEBOM()
      }
      else if (type == "process"){
        pushProcessData()
      }      
    }
  } catch (err) {
    console.error(err)
  }
  
}

function pushProcessData (){
  productionTaskStammdaten.push({   
    taskId: "T10",
    processName: "Zufuehren",
    resources: ["Werker"],
    inputProducts: ["MAT11"],
    outputProducts: ["MAT11"],
  },{   
    taskId: "T20",
    processName: "Drucken",
    resources: ["E10"],
    inputProducts: ["MAT11", "MAT12"],
    outputProducts: ["MAT111"],
  },{   
    taskId: "T30",
    processName: "Transportieren",
    resources: ["E20"],
    inputProducts: ["MAT111"],
    outputProducts: ["MAT111"],
  },{   
    taskId: "T40",
    processName: "Bestuecken",
    resources: ["E30"],
    inputProducts: ["MAT111", "M13"],
    outputProducts: ["MAT131"],
  },{   
    taskId: "T50",
    processName: "Transportieren",
    resources: ["E40"],
    inputProducts: ["MAT11"],
    outputProducts: ["MAT11"],
  },{   
    taskId: "T60",
    processName: "Loeten",
    resources: [],
    inputProducts: ["MAT11"],
    outputProducts: ["MAT11"],
  },{   
    taskId: "T70",
    processName: "Kommissionieren",
    resources: [],
    inputProducts: ["MAT11"],
    outputProducts: ["MAT11"],
  },{   
    taskId: "T80",
    processName: "Zufuehren",
    resources: [],
    inputProducts: ["MAT11"],
    outputProducts: ["MAT11"],
  },{   
    taskId: "T90",
    processName: "Zufuehren",
    resources: [],
    inputProducts: ["MAT11"],
    outputProducts: ["MAT11"],
  },{   
    taskId: "T100",
    processName: "Zufuehren",
    resources: [],
    inputProducts: ["MAT11"],
    outputProducts: ["MAT11"],
  },{   
    taskId: "T110",
    processName: "Montieren",
    resources: [],
    inputProducts: ["MAT11"],
    outputProducts: ["MAT11"],
  },{   
    taskId: "T120",
    processName: "Pruefen",
    resources: [],
    inputProducts: ["MAT11"],
    outputProducts: ["MAT11"],
  },{   
    taskId: "T130",
    processName: "Kommissionieren",
    resources: [],
    inputProducts: ["MAT11"],
    outputProducts: ["MAT11"],
  }
  
  
  )
}

function pushNewData2() {
  ebomData2.push(
    {
      id: "MAT30",
      materialId: "MAT30",
      name: "Radar",
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
      children: ["MAT10", "MAT21", "MAT22"]
    },
    {
      id: "MAT10",
      materialId: "MAT10",
      name: "Radar_BackEnd",
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
      parent: "MAT30",
      children: ["MAT11", "MAT12", "MAT13"]
    },
    {
      id: "MAT21",
      materialId: "MAT21",
      name: "Gehauuse",
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
      parent: "MAT30",
      children: []
    },
    {
      id: "MAT22",
      materialId: "MAT22",
      name: "Peripherie",
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
      parent: "MAT30",
      children: []
    },
    {
      id: "MAT11",
      materialId: "MAT11",
      name: "PCB",
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
      parent: "MAT10",
      children: []
    },
    {
      id: "MAT12",
      materialId: "MAT12",
      name: "Lötpaste",
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
      parent: "MAT10",
      children: [],
    },
    {
      id: "MAT13",
      materialId: "MAT13",
      name: "Elektrische_Bauelemente",
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
      parent: "MAT10",
      children: [],
    }  
  );
}

function pushEBOM() {  
  ebomData.push({    
    id: "MAT30",
    materialId: "MAT30",
    name: "Radar",
    produktTyp: "Fertigerzeugnis",
    imgSource: "https://th.bing.com/th/id/OIP.g4lnwUVHlNUj3vihmh7ySgHaHa?pid=ImgDet&rs=1",
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
        id: "MAT10",
        materialId: "MAT10",
        name: "Radar_BackEnd",
        imgSource: "https://www.cnx-software.com/wp-content/uploads/2020/12/tiny-mmwave-radar-sensor.jpg",
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
            id: "MAT11",
            materialId: "MAT11",
            name: "PCB",
            imgSource: "https://th.bing.com/th/id/OIP.4a2LD0Y9t0qkxqyKNFFMAAHaFj?pid=ImgDet&rs=1",
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
            parent: "MAT10",
            children: []
          },
          {
            id: "MAT12",
            materialId: "MAT12",
            name: "Loetpaste",
            imgSource: "https://th.bing.com/th/id/OIP.-DTf62EKVCNQYUJZ3Z3f-QAAAA?pid=ImgDet&rs=1",
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
            parent: "MAT10",
            children: [],
          },
          {
            id: "MAT13",
            materialId: "MAT13",
            name: "Elektrische_Bauelemente",
            imgSource: "https://th.bing.com/th/id/OIP.w3T-ro1xy-8yH-WT5VX_mwHaHa?pid=ImgDet&rs=1",
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
            parent: "MAT10",
            children: [],
          },               
        ],
      },
      {        
        id: "MAT21",
        materialId: "MAT21",
        name: "Gehaeuse",
        imgSource: "https://cdn-reichelt.de/bilder/web/xxl_ws/C700/30064456-01.png",
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
        children: []
      },
      {
        id: "MAT22",
        materialId: "MAT22",
        name: "Peripherie",
        imgSource: "https://electronic70.de/images/product_images/original_images/64626_Product.jpg",
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
        children: []
      },  
    ],
  });
}

router.route("/").get(async (req, res) => {
  res.render("plmSystem", {
    bom: ebomData,
    process: productionTaskStammdaten,
  });
});

function findInChildren(obj, itemName, itemId) {
  if (obj != null) {
    for (var i = 0; i < obj.children.length; i++) {
      if (itemName != "" && obj.children[i].name == itemName || itemId != "" && obj.children[i].id == itemId ) {
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
  // for (var i = 0; i < ebomData.length; i++) { 
  //   if (ebomData[i].name == req.params.itemName){
  //     traverseBOM (i, result);
  //     break;
  //   }
  // }
  result.BOM = findInChildren(null, req.params.itemName).children;


  res.send(result);
});

router.route("/getMBOM/:itemName").get(async (req, res) => {
  var result = {};
  result.BOM = [];
  var temp = {};
  temp.BOM = [];
  // for (var i = 0; i < ebomData.length; i++) { 
  //   if (ebomData[i].name == req.params.itemName){
  //     traverseBOM (i, temp);
  //     break;
  //   }
  // }
  temp.BOM = findInChildren(null, req.params.itemName).children;
  for (var i = 0; i < temp.BOM.length; i++){
    var alreadyInResult = false;

  }
  // for (var i = 0; i < temp.BOM.length; i++){
  //   var alreadyInResult = false;
  //   for (var j = 0; j < result.BOM.length; j++){
  //     if (temp.BOM[i].materialId == result.BOM[j].materialId && temp.BOM[i].name != req.params.itemName){
  //       result.BOM[j].amount++;
  //       alreadyInResult = true;
  //       break;
  //     }      
  //   }
  //   if (!alreadyInResult && temp.BOM[i].name != req.params.itemName){
  //     result.BOM.push( 
  //       { 
  //         materialId: temp.BOM[i].materialId,        
  //         name: temp.BOM[i].name,
  //         produktTyp: temp.BOM[i].produktTyp,
  //         amount: 1
  //       });
  //   }
  // }
  res.send(result);
});

router.route("/getMBOM_hl/:itemName").get(async (req, res) => {
  var result = {};
  result.BOM = [];
  var temp = {};
  temp.BOM = [];
  // for (var i = 0; i < ebomData.length; i++) { 
  //   if (ebomData[i].name == req.params.itemName){
  //     traverseBOM (i, temp);
  //     break;
  //   }
  // }
  temp.BOM = findInChildren(null, req.params.itemName).children;
  

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
  result.BOM.push (ebomData[currentProdIdx]);

  // traverse children
  for (var i = 0; i < ebomData[currentProdIdx].children.length; i++){    
    var nextIdx = -1;
    for (var j = 0; j < ebomData.length; j++){
      if (ebomData2[j].id.toString() == ebomData[currentProdIdx].children[i].toString()){
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
