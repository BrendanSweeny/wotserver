"use strict";

let resources = require("../..resources/model");
let utils = require("../../utils/utils");
let model = resources.pi.sensors;
let pluginName = "Temperature and Humidity";
let localParams = {"simulate": false, "frequency": 2000};

exports.start = (params) => {
  localParams = params;
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
    sensor.unexport();
  }
  console.info("%s plugin stopped!", pluginName);
};

function connectHardware() {
  let sensorDriver = require("node-dht-sensor");
  let sensor = {
    initialize: () => {
      return sensorDriver.initialize(22, model.temperature.gpio);
    },
    read: () => {
      let readout = sensorDriver.read();
      model.temperature.value = parseFloat(readout.temperature.toFixed(2));
      model.humidity.value = parseFloat(readout.humidity.toFixed(2));
      showValue();

      setTimeout(() => {
        sensor.read();
      }, localParams.frequency);
    }
  }
};

function simulate() {
  interval = setInterval(() => {
    model.temperature.value = utils.randomInt(60, 80);
    model.temperature.value = utils.randomInt(0, 100);
    showValue();
  }, localParams.frequency);
  console.info("Simluated %s sensor started!", pluginName);
};

function showValue() {
  console.info("Temperature: %s F, Humidty: %s \%",
  model.temperature.value, model.humidity.value);
};
