"use strict";

let httpServer = require("./servers/http"),
  resources = require("./resources/model");

let dhtPlugin = require("./plugins/internal/DHT22SensorPlugin");
let ledsPlugin = require("./plugins/internal/ledsPlugin");

dhtPlugin.start({'simulate': false, 'frequency': 10000});
//ledsPlugin.start({'simulate': false, 'frequency': 10000});

let server = httpServer.listen(resources.pi.port, () => {
  console.info("Your WoT Pi is up and running on port %s", resources.pi.port);
})
