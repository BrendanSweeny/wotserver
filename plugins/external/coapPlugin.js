let resources = require('./../../resources/model'),
    utils = require('./../../utils/utils.js');

let interval, me, pluginName, pollinterval;
let localParams = {'simulate': false, 'frequency': 5000};

function connectHardware () {
  let coap = require('coap'),
      bl = require('bl');

  // Creates sensor object and assigns a read function
  let sensor = {
    read: () => {
      // Read function creates CoAP UDP request to thing
      coap.request({
        host: '10.0.0.100',
        port: 5683,
        pathname: '/co2',
        options: {'Accept': 'application/json'}
      })
      .on('response', (res) => {
        console.info('CoAP response code', res.code);
        if (res.code !== '2.05') {
          console.log("Error while contacting CoAP service: %s", res.code);
        }
        res.pipe(bl((err, data) => {
          let json = JSON.parse(data);
          me.value = json.co2;
          showValue();
        }));
      }).end();
    }
  };
  // Set interval for new sensor readings
  pollinterval = setInterval(() => {
    sensor.read();
  }, localParams.frequency);
};

// Adds sensor to the resources model
function configure () {
  utils.addDevice('coapDevice', 'A CoAP Device',
  'A CoAP Device',
  {
    'co2': {
      'name': 'CO2 Sensor',
      'description': 'An ambient CO2 sensor',
      'unit': 'ppm',
      'value': 0
    }
  });
  me = resources.things.coapDevice.sensors.co2;
  pluginName = resources.things.coapDevice.name;
};

exports.start = function (params, app) {
  localParams = params;
  configure(app);

  if (params.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = function () {
  if (params.simulate) {
    clearInterval(interval);
  } else {
    clearInterval(pollinterval);
  }
  console.info('%s plugin stopped!', pluginName);
};

function simulate () {
  interval = setInterval(() => {
    me.value = utils.randomInt(0, 1000);
    showValue();
  }, localParams.frequency);
  console.info('Simulated %s sensor started!', pluginName);
};

function showValue () {
  console.info('CO2 Level: %s ppm', me.value);
}
