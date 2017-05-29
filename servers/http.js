"use strict";

let express = require("express"),
  sensorRoutes = require("./app/routes/sensors"),
  resources = require("./resources/model");

let app = express();

app.use(cors());

app.use("/pi/sensors", sensorRoutes);

app.get("/pi", (req, res) => {
  res.send("Welcome to Wotserver. I'm not as smart as HAL, but also less murdery!")
});

module.exports = app;
