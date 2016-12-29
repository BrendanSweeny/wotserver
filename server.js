"use strict";

var express = require("express");

var routes = require("./app/routes/index.js")

var app = express();

routes(app);

app.listen(8585, function () {
  console.log("Server listening on port 8585...");
})
