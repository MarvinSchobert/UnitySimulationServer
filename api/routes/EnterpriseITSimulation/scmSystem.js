const router = require("express").Router();

var stammdaten = [];

var lieferantenData = [];

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

stammdaten.push(
  { itemId: "MAT01", itemName: "Fahrrad" },
  { itemId: "MAT02", itemName: "ZSB_Rahmen" },
  { itemId: "MAT03", itemName: "Rahmen" },
  { itemId: "MAT041", itemName: "Pedal" },
  { itemId: "MAT042", itemName: "Bremse" },
  { itemId: "MAT043", itemName: "Gangschaltung" },
  { itemId: "MAT044", itemName: "Lenker" },
  { itemId: "MAT05", itemName: "Reifen" }
);

router.route("/").get(async (req, res) => {
  res.render("scmSystem", {
    lieferantenData: lieferantenData,
  });
});

router.route("/").post((req, res) => {
  console.log(req.body.parameter);
  res.redirect("/");
});

module.exports = router;
