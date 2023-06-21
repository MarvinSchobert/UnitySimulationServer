const router = require("express").Router();
const { TIMEOUT } = require("dns");
const fs = require('fs');



var categoryData = {};

initData("Categories_DigiKey.json");

function initData (path){ 
    // erst Speicherstand abfragen
    try {
      if (fs.existsSync(path)) {
        let rawdata = fs.readFileSync(path);
        let data= JSON.parse(rawdata);
  
        if (data != null && data.length != 0){
            categoryData = data;        
        }
      }
    } catch(err) {
      console.error(err)
    } 
} 

router.route("/").get(async (req, res) => {
    console.log("Categories.Length: " + categoryData.Categories.length);
    res.render("categoriesDigiKey", {
      categories: categoryData.Categories,
    });
});

module.exports = router;