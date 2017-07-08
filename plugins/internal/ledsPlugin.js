"use strict"

let resources = require("../../resources/model");
let utils = require("../../utils/utils");
let EventEmitter = require('events').EventEmitter;

module.exports = class LedController extends EventEmitter {

  constructor(params, model) {
    super();
    this.interval = undefined;
    this.actuator = undefined;
    this.model = model;
    this.pluginName = this.model.name;
    this.params = params;
    this.modelProxy = new Proxy(this.model, this.ledHandler());
  }

  start(params) {
    if (this.params.simulate) {
      this.simulate();
    } else {
      this.connectHardware();
      console.info("Hardware %s actuator started at GPIO: %s!", this.pluginName, this.model.gpio);
    }
  }

  stop() {
    if (this.params.simulate) {
      clearInterval(this.interval);
    } else {
      this.actuator.unexport();
    }
  }

  ledHandler() {
    return {
      set: (target, key, val) => {
        console.info("The LED Proxy is changing the %s value to %s", JSON.stringify(target), val);
        target[key] = val; // Performs the change in state of the model
        this.switchOnOff(val); // Performs the actual hardware change
        return true;
      }
    }
  }

  switchOnOff(value) {
    console.info(this.model.name);
    if (!this.params.simulate) {
      this.actuator.write(value === true ? 1 : 0, () => {
        console.info("LED Proxy has changed the value of %s to %s!", this.pluginName, value);
      })
    }
  }

  connectHardware() {
    let Gpio = require("onoff").Gpio;
    this.actuator = new Gpio(this.model.gpio, 'out');
  }

  simulate() {
    this.interval = setInterval(function() {
      if (this.modelProxy.value) {
        this.modelProxy.value = false;
      } else {
        this.modelProxy.value = true;
      }
    }, this.params.frequency)
    console.info('Simulated %s actuator started!', this.pluginName);
  }

}
