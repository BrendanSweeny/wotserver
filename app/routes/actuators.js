"use strict";

let express = require("express"),
  router = express.Router(),
  resources = require('../../resources/model'),
  Gpio = require("onoff").Gpio,
  ledController = require('../../plugins/internal/ledsPlugin.js'),
  localParams = {"simulate": false, "frequency": 5000};

// Define LED Controllers and assign models
let ledOne = new ledController(localParams, resources.pi.actuators.leds['1']);
let ledTwo = new ledController(localParams, resources.pi.actuators.leds['2']);

// Initiate and connect hardware for LEDs based on assigned model
ledOne.start();
ledTwo.start();

router.route('/leds/:id').get((req, res, next) => {
  req.result = resources.pi.actuators.leds[req.params.id];
  next();
}).put((req, res, next) => {
  //console.info(JSON.stringify(ledOne.modelProxy), JSON.stringify(ledTwo.modelProxy));
  if (req.params.id === '1') {
    let selectedLed = resources.pi.actuators.leds[req.params.id];
    let selectedLedProxy = ledOne.modelProxy;
    selectedLedProxy.value = req.body.value;
    req.result = selectedLed;
  } else if (req.params.id === '2') {
    let selectedLed = resources.pi.actuators.leds[req.params.id];
    let selectedLedProxy = ledTwo.modelProxy;
    selectedLedProxy.value = req.body.value;
    req.result = selectedLed;
  }
  next();
});

module.exports = router;
