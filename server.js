const express = require("express");
const expressLayouts = require("express-ejs-layouts");
var bodyParser = require("body-parser");

app = express();
port = process.env.PORT || 3000;
app.listen(port);
console.log("book list RESTful API server started on: " + port);

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

// const unityRouter = require("./api/routes/UnityService/unityServer");
// app.use("/unityServer", unityRouter);

const simulationRouter = require("./api/routes/ProcessSimulation/simulationServer");
app.use("/simulationServer", simulationRouter);

const erpRouter = require("./api/routes/EnterpriseITSimulation/erpSystem");
app.use("/erpSystem", erpRouter);

const scmRouter = require("./api/routes/EnterpriseITSimulation/scmSystem");
app.use("/scmSystem", scmRouter);

const plmRouter = require("./api/routes/EnterpriseITSimulation/plmSystem");
app.use("/plmSystem", plmRouter);

const crmRouter = require("./api/routes/EnterpriseITSimulation/crmSystem");
app.use("/crmSystem", crmRouter);

app.get("/", function (req, res) {
  res.render("index");
});

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

app.use(expressLayouts);
app.use(express.static("public"));
