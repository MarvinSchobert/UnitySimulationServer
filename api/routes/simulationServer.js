const router = require("express").Router();



router.route("/").get((req, res) => {
  // res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
  res.send ("Hello World");
});

var counter = 0;
router.route("/Innendienst/AuftragPruefen").get(async (req, res) => {
  // res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
  console.log ("Received Auftrag Prüfen Request. Waiting...");
  const NS_PER_SEC = 1e9;
  const MS_PER_NS = 1e-6
  const time = process.hrtime();
  for (var i = 2; i >= 0; i--){
    await sleep(10 * (Math.floor(Math.random() * 300) + 1));
    console.log(i + " s remaining");
  }
  counter++;
  const diff = process.hrtime(time);
  console.log ("Auftrag Prüfen Finished. Anzahl Aufträge: " + counter + `, Task took ${ (diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS} milliseconds`); 
  res.send ("Task completed");

});

router.route("/Produktion/Produzieren").get(async (req, res) => {
  // res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
  console.log ("Received Teile herstellen Request. Waiting...");
  const NS_PER_SEC = 1e9;
  const MS_PER_NS = 1e-6
  const time = process.hrtime();
  for (var i = 2; i >= 0; i--){
    await sleep(10 * (Math.floor(Math.random() * 300) + 1));
    console.log(i + " s remaining");
  }
  counter++;
  const diff = process.hrtime(time);
  console.log ("Teile herstellen Finished. Anzahl Aufträge: " + counter + `, Task took ${ (diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS} milliseconds`); 
  res.send ("Task completed");

});


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


module.exports = router;
