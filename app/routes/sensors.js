"use strict";
let express = require('express'),
  router = express.Router(),
  resources = require('../resources/model');

let path = process.cwd();

router.route('/').get((req, res, next) => {
  res.send(resources.pi.sensors);
});

router.route('/pir').get((req, res, next) => {
  res.send(resources.pi.sensors.pir);
});

router.route('/temperature').get((req, res, next) => {
  res.send(resources.pi.sensors.temperature);
});

router.route('/humidity').get((req, res, next) => {
  res.send(resources.pi.sensors.humidity);
});

module.exports = router;
