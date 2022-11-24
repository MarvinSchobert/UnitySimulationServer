const router = require("express").Router();
const fs = require('fs');

var materialStammdaten = [];
// ein Objekt: // IDs und Namen sind analog zum Materialstammdatensatz aus dem ERP-System
// {
//       itemId: String, // eine eindeutige ID
//       itemName: String, // Freitext, wie das Material heißt
// }


var lieferantenData = [];
// ein Objekt:
// {
//       name: String, // Name des Lieferanten (ein Lieferant kann auch mehrmals eingetragen sein mit unterschiedlichen Materialien oder Konditionen)
//       lieferMatName: String, // Name seines lieferbaren Materials
//       lieferMatId: String, // Stammdaten-ID des entsprechenden Materialstamms welches er liefert
//       lieferKonditionen: 
//          { 
//            stk: int // Ab so einer Liefermenge...
//            preisProStk: double // So einen Preis pro Stück
//            einheit: string // Preis in <einheit> (z. B. EUR)
//          }, 
//       lieferdauerTage: int, // wie viele Tage Planlieferzeit
// }


initData("SCM_Suppliers.json", "lieferanten");
initData("SCM_Stammdaten.json", "materialStammdaten");

// Quasi das Äquivalent zu CRM, dieser Service könnte auch SRM heißen.
// Es wird ebomData aus der Datenbank gelesen, wenn Einträge vorhanden sind, diese nehmen, ansonsten generischen Inhalt einfüllen
function initData (path, type){  
  try {
    if (fs.existsSync(path)) {
      let rawdata = fs.readFileSync(path);
      let data= JSON.parse(rawdata);

      if (data != null && data.length != 0){
        if (type == "lieferanten"){
          lieferantenData = data;
        }
       else if (type == "materialStammdaten"){
        materialStammdaten = data;
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
      { itemId: "MAT10", itemName: "Radar_BackEnd" },
      { itemId: "MAT30", itemName: "Radar" },
      { itemId: "MAT11", itemName: "PCB" },
      { itemId: "MAT12", itemName: "Lötpaste" },
      { itemId: "MAT13", itemName: "Elektrische_Bauelemente" },
      { itemId: "MAT21", itemName: "Gehäuse" },
      { itemId: "MAT22", itemName: "Peripherie" }
    );
  }
  else if (type == "lieferanten"){
    lieferantenData.push(
      {
        name: "Metall Components AG",
        lieferMatName: "PCB",
        lieferMatId: "MAT11",
        lieferKonditionen: [
          { stk: 10, preisProStk: 1, einheit: "EUR" }
        ],
        lieferDauerTage: 3,
      },
      {
        name: "Pasten GmbH",
        lieferMatId: "MAT12",
        lieferMatName: "Lötpaste",
        lieferKonditionen: [
          { stk: 100, preisProStk: 1, einheit: "EUR" }
        ],
        lieferDauerTage: 3,
      },
      {
        name: "DigiKey",
        lieferMatId: "MAT13",
        lieferMatName: "Elektrische_Bauelemente",
        lieferKonditionen: [
          { stk: 5, preisProStk: 2, einheit: "EUR" }
        ],
        lieferDauerTage: 3,
      },
      {
        name: "Kunststoff Maier GmbH",
        lieferMatId: "MAT21",
        lieferMatName: "Gehäuse",
        lieferKonditionen: [{ stk: 5, preisProStk: 1, einheit: "EUR" }],
        lieferDauerTage: 3,
      },
      {
        name: "Kabelkonfektion and More GmbH",
        lieferMatId: "MAT22",
        lieferMatName: "Peripherie",
        lieferKonditionen: [{ stk: 10, preisProStk: 1, einheit: "EUR" }],
        lieferDauerTage: 3,
      }
    );
  }
}

router.route("/").get(async (req, res) => {
  res.render("scmSystem", {
    lieferantenData: lieferantenData,
  });
});

router.route("/supplier/:itemName").get(async (req, res) => {
  var result = [];
  var itemName = req.params.itemName;

  for (var i = 0; i < lieferantenData.length; i++){
    if (lieferantenData[i].lieferMatName == itemName){
      for (var j = 0; j < lieferantenData[i].lieferKonditionen.length; j++){
        var resu = [];
        
        
        resu.push (
          lieferantenData[i].lieferKonditionen[j]
        );        
        result.push ({
          lieferMatName: lieferantenData[i].lieferMatName,
          name: lieferantenData[i].name,
          konditionen: resu
        })
      }
    }
  }

  res.send(result);
});

router.route("/").post((req, res) => {
  console.log(req.body.parameter);
  res.redirect("/");
});

router.route("/saveData").post((req, res) => {
  try {
    fs.writeFileSync("SCM_Suppliers.json", JSON.stringify(lieferantenData));
    console.log("ERP.json has been saved with the user data");
    fs.writeFileSync("SCM_Stammdaten.json", JSON.stringify(materialStammdaten));
    console.log("ERP.json has been saved with the user data");
  } catch (err) {
    console.error(err);
  }
  res.redirect("/");
});

module.exports = router;
