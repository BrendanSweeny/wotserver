"use strict";

let resources = require("../../resources/model");
let utils = require("../../utils/utils");

let interval, sensor;
let model = resources.pi.sensors;
let pluginName = "Temperature and Humidity";
let localParams = {"simulate": false, "frequency": 5000};

// Starts the plugin
exports.start = (params) => {
  localParams = params;
  if (params.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

// Stops the plugin
exports.stop = () => {
  if (params.simulate) {
    clearInterval(interval);
  } else {
    sensor.unexport();
  }
  console.info("%s plugin stopped!", pluginName);
};

// Initializes and reads the sensor at a given interval
function connectHardware() {
  let sensorDriver = require("node-dht-sensor");
  let sensor = {
    initialize: () => {
      return sensorDriver.initialize(22, model.temperature.gpio);
    },
    read: () => {
      let readout = sensorDriver.read();
      model.temperature.value = parseFloat(convertToF(readout.temperature).toFixed(2));
      model.humidity.value = parseFloat(readout.humidity.toFixed(2));
      showValue();

      setTimeout(() => {
        sensor.read();
      }, localParams.frequency);
    }
  }
  if (sensor.initialize()) {
    console.info("Hardware %s sensor started!", pluginName);
    sensor.read();
  } else {
    console.warn("Failed to initialize %s sensor!", pluginName);
  }
};

// Simulates values when hardware is not present
function simulate() {
  let interval = setInterval(() => {
    model.temperature.value = utils.randomInt(60, 80);
    model.temperature.value = utils.randomInt(0, 100);
    showValue();
  }, localParams.frequency);
  console.info("Simluated %s sensor started!", pluginName);
};

// Displays value in console and updates resource value in model
function showValue() {
  console.info("Temperature: %s F, Humidty: %s \%",
  model.temperature.value, model.humidity.value);
};

// Converts default celsius temperature to fahrenheit
function convertToF(celsius) {
  let fahrenheit = celsius * (9/5) + 32;
  return fahrenheit;
}
