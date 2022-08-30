const router = require("express").Router();


var inventory = []; // Inventar enthält Bestände
var stammdaten = ["Computer", "Chip"]; // Inventar enthält Bestände



router.route("/").get(async (req, res) => {  
    res.render("erpSystem", {
        inventory: inventory,
        stammdaten: stammdaten,
    })
});

router.route("/wareEntnehmen").post((req, res) => {
    var itemName = req.body.itemName;
    var itemAnzahl = req.body.itemAnzahl;
    
    if (verfügbarkeitPrüfen(itemName, itemAnzahl)){
        for (var i = 0; i < inventory.length; i++){
            if (inventory[i].name == itemName){
                inventory[i].anzahl -= parseInt(itemAnzahl);    
                if (inventory[i].anzahl <= 0){
                    inventory.splice(i,1);
                }            
                break;
            }      
        }    
        
    }   
    res.redirect("/erpSystem")
});

router.route("/warePruefen/:itemName/:itemAnzahl").get(async (req, res) => {    
    var result = {}
    result.itemAvailable = verfügbarkeitPrüfen(req.params.itemName, req.params.itemAnzahl);
    console.log("REQUEST PRÜFUNG")
    res.send(result);
});

function verfügbarkeitPrüfen (itemName, itemAnzahl){
    var itemAvailable = false;
    for (var i = 0; i < inventory.length; i++){
        if (inventory[i].name == itemName){
            if (inventory[i].anzahl >= parseInt(itemAnzahl)){
                itemAvailable = true;
                break;
            }          
        }      
    }   
    return itemAvailable;
}

router.route("/materialstammHinzufuegen").post((req, res) => {
    var itemName = req.body.itemName;
    var placeNew = true;
    for (var i = 0; i < stammdaten.length; i++){
        if (stammdaten[i] == itemName){
            placeNew = false;
            break;
        }      
    }    
    if (placeNew){        
        stammdaten.push (itemName);
    }
    res.redirect("/erpSystem")
});

router.route("/wareVerbuchen").post((req, res) => {
    var itemName = req.body.itemName;
    var itemAnzahl = req.body.itemAnzahl;
    var placeNew = true;
    for (var i = 0; i < inventory.length; i++){
        if (inventory[i].name == itemName){
            inventory[i].anzahl += parseInt(itemAnzahl);
            placeNew = false;
            break;
        }      
    }    
    if (placeNew){
        var newItem = {};
        newItem.name = itemName;
        newItem.anzahl = parseInt(itemAnzahl);
        inventory.push (newItem);
    }
    res.redirect("/erpSystem")
});


module.exports = router;