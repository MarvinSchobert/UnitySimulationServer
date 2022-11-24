const router = require("express").Router();
const { TIMEOUT } = require("dns");
const fs = require('fs');
var equipment = require("../EnterpriseITSimulation/equipmentSystem").equipment;


var productionTasks = [];
// Ein Objekt:
// {
//   ressourceID: string; // z. B. "E10". Synonym zu Equipment
//   inputProducts : [{
//    materialStamm: string, // z. B. "MAT131"
//    produktId: string // z. B. "MAT131-2482-2847"
//   }], 
//   outputProducts : [{
//    materialStamm: string, // z. B. "MAT131"
//    produktId: string // z. B. "MAT131-2482-2847"
//   }], 
//   processID: string, // z. B. "Fügen"
//   taskID: string, // z. B. "T12"
//   taskStatus: string, // "active", "complete", "processed"
//   taskHistory: [{
//      "status": string, // "active", "complete", "processed"
//      "time": string
//   }] 
// }

var equipmentStatus = [];
// Ein Objekt:
// {
//   equipmentName: string, // z. B. "PCB_Drucker"
//   equipmentID: string, // z. B. "E10"
//   occupationTaskID: string, // z. B. "T12"
//   occupationStatus: string, // "preparing", "processing", "idle", "broken"
// }
initData ();

function initData () {
  for (var i = 0; i < equipment.length; i++){
    if (equipment[i].status == "serie" || "musterbau"){
      var data = {};
      data.equipmentName = equipment[i].name;
      data.equipmentID = equipment[i].equipmentId;
      data.occupationStatus = "idle";
      data.occupationTaskID = "";
      equipmentStatus.push (data);
    }
  }
}



router.route("/").get(async (req, res) => {    
    res.render("manufacturingExecutionSystem", {
        productionTasks: productionTasks,
        equipmentStatus: equipmentStatus,
    });
});

router.route("/getActiveProductionTasks").get(async (req, res) => {    
  var data = [];
  for (var i = 0; i < productionTasks.length; i++){
    if (productionTasks[i].taskStatus == "active"){
      data.push (productionTasks[i]);
    }
  }
  res.send (data);
});


router.route("/addProductionTask").post((req, res) => {
  var data = {};
  data.ressourceID = req.body.ressourceID;
  data.inputProducts = req.body.inputProducts;
  data.outputProducts = req.body.outputProducts;
  data.processID = req.body.processID;
  data.taskID = req.body.taskID ?? "T"+Math.floor(Math.random() * 1000).toString();
  data.taskStatus = req.body.taskStatus ?? "active";
  data.taskHistory = req.body.taskHistory ?? [{status : "active", time: new Date(Date.now()).toLocaleString()}];
  productionTasks.push (data);    
  res.send ("Added Production Task successfully.")
});

router.route("/removeProductionTask").post((req, res) => {
  for (var i = 0; i < productionTasks.length; i++){
    if (productionTasks[i].taskID == req.body.taskID){
      productionTasks[i].splice(i, 1);
      res.send ("Removed Production Task successfully.")
      return;
    }
  } 
  res.send ("Couldn't remove Production Task.")
});

router.route("/updateProductionTask").post((req, res) => {
  for (var i = 0; i < productionTasks.length; i++){
    if (productionTasks[i].taskID == req.body.taskID){
      var data = {};
      data.ressourceID = req.body.ressourceID ?? productionTasks[i].ressourceID;
      data.outputProducts = req.body.outputProducts ?? productionTasks[i].outputProducts;
      data.inputProducts = req.body.inputProducts ?? productionTasks[i].inputProducts;
      data.processID = req.body.processID ?? productionTasks[i].processID;
      data.taskID = productionTasks[i].taskID;
      data.taskStatus = req.body.taskStatus ?? productionTasks[i].taskStatus;
      data.taskHistory = req.body.taskHistory ?? productionTasks[i].taskHistory;
      productionTasks[i] = data;
      res.send ("Updated Production Task successfully.")
      return;
    }
  } 
  res.send ("Couldn't update Production Task.")
});




router.route("/addEquipment").post((req, res) => {
  var data = {};
  data.equipmentName = req.body.equipmentName;
  data.equipmentID = req.body.equipmentID;
  data.occupationStatus = req.body.occupationStatus ?? "idle";
  data.occupationTaskID = req.body.occupationTaskID ?? "idle";
  equipmentStatus.push (data);    
  res.send ("Added equipment successfully.")
});

router.route("/removeEquipment").post((req, res) => {
  for (var i = 0; i < equipmentStatus.length; i++){
    if (equipmentStatus[i].equipmentID == req.body.equipmentID){
      equipmentStatus[i].splice(i, 1);
      res.send ("Removed equipment successfully.")
      return;
    }
  } 
  res.send ("Couldn't remove equipment.")
});

router.route("/updateEquipment").post((req, res) => {
  for (var i = 0; i < equipmentStatus.length; i++){
    if (equipmentStatus[i].equipmentID == req.body.equipmentID){
      var data = {};
      data.equipmentID = equipmentStatus[i].equipmentID;
      data.equipmentName = req.body.equipmentName ?? equipmentStatus[i].equipmentName;
      data.occupationStatus = req.body.occupationStatus ?? equipmentStatus[i].occupationStatus;
      data.occupationTaskID = req.body.occupationTaskID ?? equipmentStatus[i].occupationTaskID;
      equipmentStatus[i] = data;
      res.send ("Updated equipment successfully.")
      return;
    }
  } 
  res.send ("Couldn't update equipment.")
});


module.exports = router;
