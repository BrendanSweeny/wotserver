//"use strict";

let resources = require("../../resources/model");
let utils = require("../../utils/utils");
let EventEmitter = require('events').EventEmitter;

let interval, sensor;
let model = resources.pi.sensors;
let pluginName = "Temperature and Humidity";
let localParams = {"simulate": false, "frequency": 5000};

module.exports = class DHT22SensorController extends EventEmitter {

  constructor(params, model) {
    super();
    this.interval = undefined;
    this.sensor = undefined;
    this.model = model;
    this.pluginName = this.model.name;
    this.params = params;
  }

  start() {
    if (this.params.simulate) {
      this.simulate();
    } else {
      this.connectHardware();
      console.info("%s plugin started!", pluginName)
    }
  }

  stop() {
    if (this.params.simulate) {
      clearInterval(this.interval);
    } else {
      this.sensor.unexport();
    }
    console.info("%s plugin stopped!", pluginName);
  }

  connectHardware() {
    let sensorDriver = require("node-dht-sensor");
    this.sensor = {
      initialize: () => {
        return sensorDriver.initialize(22, model.temperature.gpio);
      },
      read: () => {
        let readout = sensorDriver.read();
        this.model.temperature.value = parseFloat(this.convertToF(readout.temperature).toFixed(2));
        this.emit('tempEvent');
        this.model.humidity.value = parseFloat(readout.humidity.toFixed(2));
        this.emit('humEvent');
        this.showValue();

        setTimeout(() => {
          this.sensor.read();
        }, this.params.frequency);
      }
    }
    if (this.sensor.initialize()) {
      console.info("Hardware %s sensor started!", pluginName);
      this.sensor.read();
    } else {
      console.warn("Failed to initialize %s sensor!", pluginName);
    }
  }

  showValue() {
    console.info("Temperature: %s F, Humidty: %s \%",
    this.model.temperature.value, this.model.humidity.value);
  }

  // Converts default celsius temperature to fahrenheit
  convertToF(celsius) {
    let fahrenheit = celsius * (9/5) + 32;
    return fahrenheit;
  }
}

/*
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
*/
