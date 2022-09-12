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
      { itemId: "MAT01", itemName: "Fahrrad" },
      { itemId: "MAT02", itemName: "ZSB_Rahmen" },
      { itemId: "MAT03", itemName: "Rahmen" },
      { itemId: "MAT041", itemName: "Pedal" },
      { itemId: "MAT042", itemName: "Bremse" },
      { itemId: "MAT043", itemName: "Gangschaltung" },
      { itemId: "MAT044", itemName: "Lenker" },
      { itemId: "MAT05", itemName: "Reifen" }
    );
  }
  else if (type == "lieferanten"){
    lieferantenData.push(
      {
        name: "Metall AG",
        lieferMatName: "Rahmen",
        lieferMatId: "MAT03",
        lieferKonditionen: [
          { stk: 1, preisProStk: 140, einheit: "EUR" },
          { stk: 10, preisProStk: 120, einheit: "EUR" },
        ],
        lieferDauerTage: 3,
      },
      {
        name: "Fahrradkomponenten GmbH",
        lieferMatId: "MAT041",
        lieferMatName: "Pedal",
        lieferKonditionen: [
          { stk: 1, preisProStk: 10, einheit: "EUR" },
          { stk: 20, preisProStk: 7, einheit: "EUR" },
        ],
        lieferDauerTage: 3,
      },
      {
        name: "Fahrradkomponenten GmbH",
        lieferMatId: "MAT042",
        lieferMatName: "Bremse",
        lieferKonditionen: [
          { stk: 1, preisProStk: 20, einheit: "EUR" },
          { stk: 10, preisProStk: 18, einheit: "EUR" },
        ],
        lieferDauerTage: 3,
      },
      {
        name: "Fahrradkomponenten GmbH",
        lieferMatId: "MAT043",
        lieferMatName: "Gangschaltung",
        lieferKonditionen: [{ stk: 1, preisProStk: 25, einheit: "EUR" }],
        lieferDauerTage: 3,
      },
      {
        name: "Fahrradkomponenten GmbH",
        lieferMatId: "MAT044",
        lieferMatName: "Lenker",
        lieferKonditionen: [{ stk: 1, preisProStk: 15, einheit: "EUR" }],
        lieferDauerTage: 3,
      },
      {
        name: "Wheels and More Inc",
        lieferMatId: "MAT05",
        lieferMatName: "Reifen",
        lieferKonditionen: [
          { stk: 1, preisProStk: 15, einheit: "EUR" },
          { stk: 50, preisProStk: 11, einheit: "EUR" },
        ],
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
