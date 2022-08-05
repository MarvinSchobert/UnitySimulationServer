const express = require("express");
const expressLayouts = require("express-ejs-layouts");
app = express();
port = process.env.PORT || 3000;
app.listen(port);
console.log("book list RESTful API server started on: " + port);

const unityRouter = require("./api/routes/unityServer");
app.use("/unityServer", unityRouter);

const simulationRouter = require("./api/routes/simulationServer");
app.use("/simulationServer", simulationRouter);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

app.use(expressLayouts);
app.use(express.static("public"));
