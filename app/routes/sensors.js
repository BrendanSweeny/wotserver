"use strict";
let express = require('express'),
  router = express.Router(),
  resources = require('../../resources/model');

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

module.exports = router;
