const router = require("express").Router();

var erpData = [];

router.route("/").get(async (req, res) => {  
    res.render("plmSystem")
});

router.route("/getProductBOM/:itemName").get(async (req, res) => {  
    var result = {}
    result.BOM = []
    result.BOM.push ("Chip");
    res.send (result)
});


router.route("/").post((req, res) => {
    console.log(req.body.parameter)
    res.redirect("/")
});


module.exports = router;