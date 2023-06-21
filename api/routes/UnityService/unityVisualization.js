const router = require("express").Router(); ("use strict");
router.route("/").get((req, res) => {
    res.render("unityVisualization", {

    });
});

module.exports = router;