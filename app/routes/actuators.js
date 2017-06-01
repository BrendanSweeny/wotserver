"use strict";

let express = require("express"),
  router = express.Router(),
  resources = require('../../resources/model'),
  Gpio = require("onoff").Gpio,
  pluginName = "LED",
  localParams = {"simulate": false, "frequency": 5000},
  actuator = new Gpio(resources.pi.actuators.leds[1].gpio, 'out');

let path = process.cwd();

let handler = {
  set: (target, key, val) => {
    console.info("Setting value of %s", val);
    target[key] = val; // Performs the change in state of the model
    switchOnOff(val); // Performs the actual hardware change
    return true;
  }
};

function switchOnOff(value) {
  if (!localParams.simulate) {
    actuator.write(value === true ? 1 : 0, () => {
      console.info("Proxy changed value of %s to %s!", pluginName, value);
    })
  }
};

router.route('/leds/:id').get((req, res, next) => {
  req.result = resources.pi.actuators.leds[req.params.id];
  next();
}).put((req, res, next) => {
  let selectedLed = resources.pi.actuators.leds[req.params.id];
  let proxy = new Proxy(selectedLed, handler);
  proxy.value = req.body.value;
  console.info("Changed LED %s value to %s", req.params.id, proxy.value);
  req.result = selectedLed;
  next();
});

module.exports = router;
