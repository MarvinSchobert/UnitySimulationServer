const router = require("express").Router();

const fs = require('fs');




var kundenData = [];
// ein Objekt:
// {
//       name: String, // Name des Kunden (ein Kunde kann auch mehrmals eingetragen sein mit unterschiedlichen Lieferadressen)  
//       lieferKonditionen: 
//          {
//            matId: string, // Welche MaterialId enthält diese Konditionen
//            stk: int // Ab so einer Liefermenge...
//            preisProStk: double // So einen Preis pro Stück
//            einheit: string // Preis in <einheit> (z. B. EUR)
//          }, 
//       lieferAdresse: string // Anschrift des Kunden
// }


initData("CRM_Customers.json", "kunden");


function initData (path, type){  
  try {
    if (fs.existsSync(path)) {
      let rawdata = fs.readFileSync(path);
      let data= JSON.parse(rawdata);

      if (data != null && data.length != 0){
        if (type == "kunden"){
            kundenData = data;
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
  if (type == "kunden"){
    kundenData.push(
      {
        name: "Radhaus",
        lieferKonditionen: [
          { matId: "MAT01", stk: 1, preisProStk: 800, einheit: "EUR" },
          { matId: "MAT01", stk: 10, preisProStk: 650, einheit: "EUR" },
        ],
        lieferAdresse: "Schlossallee 3, 12345 Musterstadt"
      },
      {
        name: "Stadler",
        lieferKonditionen: [
          { matId: "MAT01", stk: 1, preisProStk: 850, einheit: "EUR" },
          { matId: "MAT01", stk: 15, preisProStk: 620, einheit: "EUR" },
        ],
        lieferAdresse: "Am Ring 2, 12345 Musterstadt"
      },      
    );
  }
}

router.route("/").get(async (req, res) => {
  res.render("crmSystem", {
    kundenData: kundenData,
  });
});

router.route("/customerExistent/:name/:matID").get(async (req, res) => {
    result = true;
    res.send (result);
});


router.route("/saveData").post((req, res) => {
  try {
    fs.writeFileSync("CRM_Customers.json", JSON.stringify(kundenData));
    console.log("CRM_Customers.json has been saved with the user data");
  } catch (err) {
    console.error(err);
  }
  res.redirect("/crmSystem");
});

module.exports = router;
