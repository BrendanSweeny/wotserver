"use strict";

let express = require("express"),
  sensorRoutes = require("../app/routes/sensors"),
  resources = require("../resources/model"),
  cors = require('cors'),
  converter = require('../middleware/converter');

let app = express();

app.use(cors());

app.use("/pi/sensors", sensorRoutes);

app.get("/pi", (req, res) => {
  res.send("Welcome to Wotserver. I'm not as smart as HAL, but also less murdery!")
});

app.use(converter());

module.exports = app;
