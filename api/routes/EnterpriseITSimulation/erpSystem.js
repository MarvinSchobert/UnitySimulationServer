const router = require("express").Router();
const fs = require('fs');

var inventory = []; // Inventar enthält Materialbestände
// ein Objekt:
// {
//     itemId: String, // ID von zugehörigem Materialstammsatz. 
//                      Wenn den Stammdaten nicht bekannt, dann ists ne Extra-Ware, die nicht statistisch usw. getrackt wird
//     itemName: String, // AUs den materialStammdaten kriegt das Item nen Namen
//     itemAnzahl: int, // Wie viele Items davon sind vorhanden
//     lagerortId: String, // In welchem Lager steckt das
// }

var materialStammdaten = []; // Materialstammsätze --> Enthält alle vorhandenen Materialarten
// ein Objekt:
// {
//     itemId: String, // Stammdatensätze enthalten ne eindeutige MaterialID
//     produktTyp: String, // Halberzeugnis, Fertigerzeugnis, Rohmaterial
//     itemName: String, // mit nem Namen
// }

var lagerortStammdaten = []; // Lagerortstammsätze --> Enthält alle vorhandenen Lagerorte
// ein Objekt:
// {
//     lagerortId: String, // eine eindeutige Id
//     lagerortBezeichnung: String, // Freitext wo das liegt (bspw. "Werk München")
//     lagerortTyp: String [], // Welcher Typ ist das: (Region, Land, Werk, Wareneingangslager, Warenausgangslager, Pufferlager, Sonstiges)
//     lagerortParent: String <lagerortId>, // wenn == "" ist es die oberste Ebene. wenn != "", dann Zugehörigkeit des Lagers zu einem anderen. 
//                      Bspw. Hierachie: Region (Europa), Land (Deutschland), Werk (München01), Lager (M001)
//     lagerortChildren: String [] <lagerortIds>, // Ob LagerOrte untergeordnet sind
// }

var auftraege = []; // enthält alle internen un externen Bestellungen mit Auswirkungen auf Lagerbestände
// ein Objekt:
// {
//       auftragsId: String, // eine eindeutige ID
//       auftragsTyp: String, // der Auftragstyp, bspw. "Bestellung", "Umlagerung", "Produktionsauftrag"
//       kundenId: String // ID des Kunden (kann auch eine interne Abteilung sein bei Umlagerung oder Produktionsauftrag)
//       itemId: String, // Stammdaten-ID des entsprechenden Materialstamms
//       itemAnzahl: int, // Wie viel Material betrifft das?
//       lagerortId: String, // welches Werk/ Lager betrifft das alles
//       bestellDatum: String, // Wann wurde bestellt
//       lieferDatumSoll: String, // Wann soll geliefert werden
//       lieferDatumGeplant: String, // Wann ist das geplante Lieferdatum
//       lieferDatumIst: String, // Wann wurde tatsächlich geliefert
//       status: String[], // Stati können gepusht werden, letzterer ist der aktuellste
// }

initData("ERP_Inventory.json", "bestand");
initData("ERP_StammdatenMaterialien.json", "materialStammdaten");
initData("ERP_StammdatenLagerorte.json", "lagerortStammdaten");
initData("ERP_Auftraege.json", "auftraege");
// Es wird ebomData aus der Datenbank gelesen, wenn Einträge vorhanden sind, diese nehmen, ansonsten generischen Inhalt einfüllen
function initData (path, type){  
  try {
    if (fs.existsSync(path)) {
      let rawdata = fs.readFileSync(path);3
      let data= JSON.parse(rawdata);

      if (data != null && data.length != 0){
        if (data != null && data.length != 0){
          if (type == "bestand"){
            inventory = data;
          }
          else if (type == "materialStammdaten"){
            materialStammdaten = data;
          }        
          else if (type == "lagerortStammdaten"){
            lagerortStammdaten = data;
          }          
          else if (type == "auftraege"){
            auftraege = data;
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
  if (type == "materialStammdaten"){
    materialStammdaten.push(
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
  else if (type == "lagerortStammdaten"){
    lagerortStammdaten.push(
      { lagerortID: "REG01", lagerortBezeichnung: "Region Europa", lagerortTyp: ["Region"], lagerortParent: "", lagerortChildren: ["LAND01"] },
      { lagerortID: "LAND01", lagerortBezeichnung: "Deutschland", lagerortTyp: ["Land"], lagerortParent: "REG01", lagerortChildren: ["WERK01"] },
      { lagerortID: "WERK01", lagerortBezeichnung: "Werk Muenchen", lagerortTyp: ["Werk"], lagerortParent: "LAND01", lagerortChildren: ["LAG01", "LAG02", "LAG03"] },
      { lagerortID: "LAG01", lagerortBezeichnung: "Eingangslager München", lagerortTyp: ["Wareneingangslager"], lagerortParent: "WERK01", lagerortChildren: [] },
      { lagerortID: "LAG02", lagerortBezeichnung: "Ausgangslager München", lagerortTyp: ["Warenausgangslager", "Pufferlager"], lagerortParent: "WERK01", lagerortChildren: [] },
      { lagerortID: "LAG03", lagerortBezeichnung: "Pufferlager München", lagerortTyp: ["Pufferlager"], lagerortParent: "WERK01", lagerortChildren: [] },
    );
  }
}
var auftraege = []; // Enthält alle Aufträge und ihren Bearbeitungsfortschritt

router.route("/").get(async (req, res) => {
  res.render("erpSystem", {
    inventory: inventory,
    materialStammdaten: materialStammdaten,
    auftraege: auftraege,
    lagerortStammdaten: lagerortStammdaten,
  });
});


router.route("/saveData").post((req, res) => {
  try {
    fs.writeFileSync("ERP_Inventory.json", JSON.stringify(inventory));
    fs.writeFileSync("ERP_StammdatenMaterialien.json", JSON.stringify(materialStammdaten));
    fs.writeFileSync("ERP_StammdatenLagerorte.json", JSON.stringify(lagerortStammdaten));
    fs.writeFileSync("ERP_Auftraege.json", JSON.stringify(auftraege));
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

router.route("/lagerortstammHinzufuegen").post((req, res) => {
  var _lagerortId = req.body.lagerortId;
  var _lagerortBezeichnung = req.body.lagerortBezeichnung;
  var _lagerortTyp = req.body.lagerortTyp;
  var placeNew = true;
  var _lagerortParent = req.body.lagerortParent;
  var _lagerortChildren = req.body.lagerortChildren;
  for (var i = 0; i < lagerortStammdaten.length; i++) {
    if (lagerortStammdaten[i].lagerortId == _lagerortId) {
      placeNew = false;
      break;
    }
  }
  if (placeNew) {
    lagerortStammdaten.push({
      lagerortId: _lagerortId.toString(),
      lagerortBezeichnung: _lagerortBezeichnung.toString(),
      lagerortTyp: _lagerortTyp.toString(),
      lagerortParent: _lagerortParent.toString(),
      lagerortChildren: _lagerortChildren.toString(),
    });
  }
  res.redirect("/erpSystem");
});

router.route("/materialstammHinzufuegen").post((req, res) => {
  var _itemName = req.body.itemName;
  var _produktTyp = req.body.produktTyp;
  var _itemId = req.body.itemId;
  var placeNew = true;
  for (var i = 0; i < materialStammdaten.length; i++) {
    if (materialStammdaten[i].itemId == _itemId) {
      placeNew = false;
      break;
    }
  }
  if (placeNew) {
    materialStammdaten.push({
      itemName: _itemName.toString(),
      itemId: _itemId.toString(),
      produktTyp: _produktTyp.toString(),
    });
  }
  res.redirect("/erpSystem");
});

router.route("/auftragHinzufuegen").post((req, res) => {
  var _auftragsId = req.body.auftragsId;
  var _auftragsTyp = req.body.auftragsTyp;
  var _kundenId = req.body.kundenId;
  var _itemId = req.body.itemId;
  var _itemAnzahl = req.body.itemAnzahl;
  var _lagerortId = req.body.lagerortId;
  var _bestellDatum = req.body.bestellDatum;
  var _lieferDatumSoll = req.body.lieferDatumSoll;
  var _lieferDatumGeplant = req.body.lieferDatumGeplant;
  var _lieferDatumIst = req.body.lieferDatumIst;
  var _status = [];
  var placeNew = true;
  for (var i = 0; i < auftraege.length; i++) {
    if (auftraege[i]._auftragsId == _auftragsId) {
      placeNew = false;
      break;
    }
  }
  if (placeNew) {
    var newAuftrag = {};
    newAuftrag.auftragsId = _auftragsId.toString();
    newAuftrag.auftragsTyp = _auftragsTyp.toString();
    newAuftrag.bestellDatum = _bestellDatum.toString();
    newAuftrag.lieferDatumSoll = _lieferDatumSoll.toString();
    // newAuftrag.lieferDatumGeplant = _lieferDatumGeplant.toString();

    newAuftrag.itemId = _itemId.toString();
    newAuftrag.kundenId = _kundenId.toString();
    newAuftrag.status = _status;
    newAuftrag.lagerortId = _lagerortId.toString();

    newAuftrag.itemAnzahl = parseInt(_itemAnzahl);

    auftraege.push(newAuftrag);
  }
  res.redirect("/erpSystem");
});

router.route("/auftragBearbeiten").post((req, res) => {
  
  res.redirect("/erpSystem");
});

router.route("/wareVerbuchen").post((req, res) => {
  var itemName = req.body.itemName;
  var itemAnzahl = req.body.itemAnzahl;
  var lagerortId = req.body.lagerortId;
  var placeNew = true;
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].itemName == itemName && inventory[i].lagerortId == lagerortId) {
      inventory[i].itemAnzahl += parseInt(itemAnzahl);
      placeNew = false;
      break;
    }
  }
  if (placeNew) {
    var newItem = {};
    newItem.itemName = itemName.toString();
    newItem.itemAnzahl = parseInt(itemAnzahl);
    newItem.lagerortId = lagerortId.toString();
    inventory.push(newItem);
  }
  res.redirect("/erpSystem");
});

router.route("/wareEntnehmen").post((req, res) => {
  var itemName = req.body.itemName;
  var itemAnzahl = req.body.itemAnzahl;

  if (verfügbarkeitPrüfen(itemName, itemAnzahl)) {
    for (var i = 0; i < inventory.length; i++) {
      if (inventory[i].itemName == itemName && inventory[i].lagerortId == lagerortId) {
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

// REST API GET REQUESTS:
router.route("/inventory").get(async (req, res) => {
  var result = inventory;
  res.send(result);
});

router.route("/inventory/:LagerID").get(async (req, res) => {
  var result = {};

  for (var i = 0; i < inventory.length; i++){
    if (inventory[i].lagerortId == req.params.LagerID){
      result.push(inventory[i]);
    }
  }
  res.send(result);
});

router.route("/materialstamm").get(async (req, res) => {
  var result = materialStammdaten;
  res.send(result);
});

router.route("/lagerortstamm").get(async (req, res) => {
  var result = lagerortStammdaten;
  res.send(result);
});

module.exports = router;
