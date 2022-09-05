const router = require("express").Router();
const fs = require('fs');

var inventory = []; // Inventar enthält Bestände
// ein Objekt:
// {
//     itemId: String, // Stammdatensätze enthalten ne eindeutige MaterialID
//     itemName: String, // AUs den Stammdaten kriegt das Item nen Namen
//     itemAnzahl: int, // Wie viele Items davon sind vorhanden
//     lagerId: String // In welchem Lager steckt das
// }

var stammdaten = []; // Inventar enthält Bestände
// ein Objekt:
// {
//     itemId: String, // eine eindeutige Id
//     produktTyp: String, // Halberzeugnis, Fertigerzeugnis, Rohmaterial
//     itemName: String // mit nem Namen
// }

initData("ERP_Inventory.json", "");
initData("ERP_Stammdaten.json", "stammdaten");
// Es wird ebomData aus der Datenbank gelesen, wenn Einträge vorhanden sind, diese nehmen, ansonsten generischen Inhalt einfüllen
function initData (path, type){  
  try {
    if (fs.existsSync(path)) {
      let rawdata = fs.readFileSync(path);
      let data= JSON.parse(rawdata);

      if (data != null && data.length != 0){
        if (data != null && data.length != 0){
          if (type == ""){
            inventory = data;
          }
         else if (type == "stammdaten"){
          stammdaten = data;
          }
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
  if (type == "stammdaten"){
    stammdaten.push(
      { itemId: "MAT01", itemName: "Fahrrad", produktTyp: "Fertigerzeugnis" },
      { itemId: "MAT02", itemName: "ZSB_Rahmen", produktTyp: "Halberzeugnis" },
      { itemId: "MAT03", itemName: "Rahmen", produktTyp: "Rohmaterial" },
      { itemId: "MAT041", itemName: "Pedal", produktTyp: "Rohmaterial" },
      { itemId: "MAT042", itemName: "Bremse", produktTyp: "Rohmaterial" },
      { itemId: "MAT043", itemName: "Gangschaltung", produktTyp: "Rohmaterial" },
      { itemId: "MAT044", itemName: "Lenker", produktTyp: "Rohmaterial" },
      { itemId: "MAT05", itemName: "Reifen", produktTyp: "Rohmaterial" }
    );
  }
}
var auftraege = []; // Enthält alle Aufträge und ihren Bearbeitungsfortschritt

router.route("/").get(async (req, res) => {
  res.render("erpSystem", {
    inventory: inventory,
    stammdaten: stammdaten,
  });
});

router.route("/wareEntnehmen").post((req, res) => {
  var itemName = req.body.itemName;
  var itemAnzahl = req.body.itemAnzahl;

  if (verfügbarkeitPrüfen(itemName, itemAnzahl)) {
    for (var i = 0; i < inventory.length; i++) {
      if (inventory[i].itemName == itemName) {
        inventory[i].itemAnzahl -= parseInt(itemAnzahl);
        if (inventory[i].itemAnzahl <= 0) {
          inventory.splice(i, 1);
        }
        break;
      }
    }
  }
  res.redirect("/erpSystem");
});

router.route("/saveData").post((req, res) => {
  try {
    fs.writeFileSync("ERP_Inventory.json", JSON.stringify(inventory));
    console.log("ERP.json has been saved with the user data");
    fs.writeFileSync("ERP_Stammdaten.json", JSON.stringify(stammdaten));
    console.log("ERP.json has been saved with the user data");
  } catch (err) {
    console.error(err);
  }
  res.redirect("/");
});


router.route("/warePruefen/:itemName/:itemAnzahl").get(async (req, res) => {
  var result = {};
  result.itemAvailable = verfügbarkeitPrüfen(
    req.params.itemName,
    req.params.itemAnzahl
  );
  console.log("REQUEST PRÜFUNG");
  res.send(result);
});

function verfügbarkeitPrüfen(itemName, itemAnzahl) {
  var itemAvailable = false;
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].itemName == itemName) {
      if (inventory[i].itemAnzahl >= parseInt(itemAnzahl)) {
        itemAvailable = true;
        break;
      }
    }
  }
  return itemAvailable;
}

router.route("/materialstammHinzufuegen").post((req, res) => {
  var _itemName = req.body.itemName;
  var _produktTyp = req.body.produktTyp;
  var _itemId = req.body.itemId;
  var placeNew = true;
  for (var i = 0; i < stammdaten.length; i++) {
    if (stammdaten[i].itemId == _itemId) {
      placeNew = false;
      break;
    }
  }
  if (placeNew) {
    stammdaten.push({
      itemName: _itemName.toString(),
      itemId: _itemId.toString(),
      produktTyp: _produktTyp.toString(),
    });
  }
  res.redirect("/erpSystem");
});

router.route("/wareVerbuchen").post((req, res) => {
  var itemName = req.body.itemName;
  var itemAnzahl = req.body.itemAnzahl;
  var placeNew = true;
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].itemName == itemName) {
      inventory[i].itemAnzahl += parseInt(itemAnzahl);
      placeNew = false;
      break;
    }
  }
  if (placeNew) {
    var newItem = {};
    newItem.itemName = itemName.toString();
    newItem.itemAnzahl = parseInt(itemAnzahl);
    inventory.push(newItem);
  }
  res.redirect("/erpSystem");
});

module.exports = router;
