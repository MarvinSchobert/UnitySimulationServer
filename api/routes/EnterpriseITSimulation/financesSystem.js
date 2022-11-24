const router = require("express").Router();
const { TIMEOUT } = require("dns");
const fs = require('fs');

var transactions = [];
// {
//      beschreibung: String, // Verwendungszweck der Transaktion
//      betrag: int, // Betrag der Transaktion
//      kontakt: String // Gläubiger bzw. Schuldner der Transaktion
// }

// Startkapital der Simulation hier eingeben:
var balance = 100000;


router.route("/").get(async (req, res) => {
    
    res.render("financesSystem", {
        balance: balance,
        transactions: transactions,
      });
  });


router.route("/addTransaction").post((req, res) => {
    var beschreibung = req.body.beschreibung;
    var betrag = req.body.betrag;
    var kontakt = req.body.kontakt;
    
    transactions.push ({
        beschreibung: beschreibung,
        betrag: betrag,
        kontakt: kontakt
    })
    
    balance += parseInt(betrag);

    res.redirect("/financesSystem");
  });

module.exports = router;
