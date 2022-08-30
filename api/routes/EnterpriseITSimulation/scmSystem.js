const router = require("express").Router();

var erpData = [];

router.route("/").get(async (req, res) => {  
    res.render("scmSystem")
});

router.route("/").post((req, res) => {
    console.log(req.body.parameter)
    res.redirect("/")
});


module.exports = router;