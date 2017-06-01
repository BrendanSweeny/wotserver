"use strict"

let resources = require("../../resources/model");
let utils = require("../../utils/utils");
let localParams = {"simulate": false, "frequency": 5000};
let pluginName = "LED";
let model = resources.pi.actuators.leds[1];
let interval, actuator;

exports.start = (params) => {
  localParams = params;
  //observe(model);
  //model.value = false;

  if (localParams.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = () => {
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
    actuator.unexport();
  }
  console.log("%s plugin stopped!", pluginName);
};

let handler = {
  get: (target, key) => {
    console.info("Setting value of %s", key);
    //switchOnOff(val);
  }
}

function observe(target) {
  console.log(target);
  console.info("Observe " + pluginName + " started!");
  let proxy = new Proxy(target, handler);
  console.info(proxy);
};

function switchOnOff(value) {
  if (!localParams.simulate) {
    actuator.write(value === true ? 1 : 0, () => {
      console.info("Proxy changed value of %s to %s!", pluginName, value);
    })
  }
};

function connectHardware() {
  let Gpio = require("onoff").Gpio;
  actuator = new Gpio(model.gpio, 'out');
  console.info("Hardware %s actuator started!", pluginName);
};
