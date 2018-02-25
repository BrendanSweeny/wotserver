"use strict";

let express = require("express"),
  sensorRoutes = require("../app/routes/sensors"),
  resources = require("../resources/model"),
  actuatorRoutes = require("../app/routes/actuators"),
  cors = require('cors'),
  converter = require('../middleware/converter'),
  bodyParser = require('body-parser');
  //coapPlugin = require('../plugins/external/coapPlugin');

//coapPlugin.start({'simulate': false, 'frequency': 5000});

let app = express();

app.use(bodyParser.json());

app.use(cors());

app.use("/pi/sensors", sensorRoutes);
app.use("/pi/actuators", actuatorRoutes);

app.get("/pi", (req, res) => {
  res.send("Welcome to Wotserver. I'm not as smart as HAL, but also less murdery!")
});

app.use(converter());

module.exports = app;
