const router = require("express").Router();
const fs = require('fs');

var bpmnModel;

router.route("/").get(async (req, res) => {
  res.render("bpmnModellerIndex", {
  });
});

router.route("/graph").get(async (req, res) => {
  res.render('graphVisualizer', {
    nodes_input: [
      { id: 1, label: 'Anlage X2', title: "I have a popup!" },
      { id: 2, label: 'Anlage Y2', title: "I have a popup!" },
      { id: 3, label: 'Anlage Z1', title: "I have a popup!" },
      { id: 4, label: 'Anlage Z56', title: "I have a popup!" },
      { id: 5, label: 'Anlage Y5', title: "I have a popup!" },
      { id: 6, label: 'Linie 1', title: "I have a popup!" },
      { id: 7, label: 'Werk Ingolstadt', title: "I have a popup!" },
      { id: 8, label: 'Linie 2', title: "I have a popup!" },
      { id: 9, label: 'Anlage Y', title: "I have a popup!" },
      { id: 10, label: 'Linie 3', title: "I have a popup!" },
      { id: 11, label: 'Anlage X', title: "I have a popup!" },
      { id: 12, label: 'Bürogebäude 1', title: "I have a popup!" }
    ],
    edges_input: [
      { from: 6, to: 1 },
      { from: 6, to: 2 },
      { from: 6, to: 5 },
      { from: 6, to: 7 },
      { from: 7, to: 8 },
      { from: 7, to: 10 },
      { from: 7, to: 12 },
      { from: 8, to: 3 },
      { from: 8, to: 4 },
      { from: 10, to: 9 },
      { from: 10, to: 11 }
    ]
  });
});
// Render the 'graph' template, passing in a data object with a 'nodes' and 'edges' array


router.route("/model").get(async (req, res) => {
  res.send (bpmnModel);
});

router.route("/").post((req, res) => {
  console.log ("New Message: " + req.body.xml)
  res.redirect("/bpmn");
});


module.exports = router;
