"use strict";
let express = require('express'),
  router = express.Router(),
  resources = require('../../resources/model'),
  dhtPlugin = require('../../plugins/internal/DHT22SensorPlugin');

// Create and assign model to sensor objects
//let tempHumidity = new dhtPlugin({"simulate": false, "frequency": 5000}, resources.pi.sensors)

// Initialize and connect hardware for sensor objects
//tempHumidity.start();

let path = process.cwd();

router.route('/').get((req, res, next) => {
  req.result = resources.pi.sensors;
  next();
});

router.route('/pir').get((req, res, next) => {
  req.result = resources.pi.sensors.pir;
  next();
});

router.route('/temperature').get((req, res, next) => {
  req.result = resources.pi.sensors.temperature;
  next();
});

router.route('/humidity').get((req, res, next) => {
  req.result = resources.pi.sensors.humidity;
  next();
});

router.route('/coapDevice/sensors/co2').get((req, res, next) => {
  req.result = resources.things.coapDevice.sensors.co2;
  next();
})

module.exports = router;
