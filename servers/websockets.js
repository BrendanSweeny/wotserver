"use strict";

let WebSocketServer = require('ws').Server,
  resources = require('../resources/model'),
  TempHumSensor = require('../plugins/internal/DHT22SensorPlugin'),
  ledController = require('../plugins/internal/ledsPlugin.js'),
  localParams = {"simulate": false, "frequency": 5000};

// Create and assign model to sensor objects
let temphumsensor = new TempHumSensor({"simulate": false, "frequency": 5000}, resources.pi.sensors);

// Initialize and connect hardware for sensor objects
temphumsensor.start();

// Define LED Controllers and assign models
let ledOne = new ledController(localParams, resources.pi.actuators.leds['1']);
let ledTwo = new ledController(localParams, resources.pi.actuators.leds['2']);

// Initiate and connect hardware for LEDs based on assigned model
ledOne.start();
ledTwo.start();

exports.listen = (server) => {
  let wss = new WebSocketServer({server: server});
  console.info('WebSocket server started...');
  wss.on('connection', (ws, req) => {
    let url = req.url;
    let resourceObject = selectResource(url);
    console.info(url);
    //console.info(resourceObject);
    console.log(`The sensor object event name is ${resourceObject.eventName}.`)
    temphumsensor.on(resourceObject.eventName, () => {
      ws.send(JSON.stringify(resourceObject), () => {
        console.log('ws.send function called by temphumsensor!');
      //  console.log(resourceObject);
      });
    });
    ledOne.on(resourceObject.eventName, () => {
      ws.send(JSON.stringify(resourceObject), () => {
        console.log('ws.send function called by ledOne!');
      //  console.log(resourceObject);
      });
    });
    ledTwo.on(resourceObject.eventName, () => {
      ws.send(JSON.stringify(resourceObject), () => {
        console.log('ws.send function called by ledTwo!');
      //  console.log(resourceObject);
      });
    });
  });
};

function selectResource(url) {
  let parts = url.split('/');
  //console.info("Parts before shift: ", parts);
  parts.shift();
  //console.info("Parts after shift: ", parts);
  let result = resources;

  for (let i = 0; i < parts.length; i++) {
    result = result[parts[i]];
  }
  console.info('Selected resource is: ' + JSON.stringify(result));
  return result;
}
