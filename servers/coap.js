const coap = require('coap'),
      utils = require('./../utils/utils.js');

let port  = 5683;
coap.createServer((req, res) => {
  req.on('error', (error) => {
    console.info(error);
  }
  console.info('CoAP device got a request for %s', req.url);

  // Only JSON data is served, '4.06': 'Not Acceptable'
  if (req.headers['Accept'] != 'application/json') {
    res.code = '4.06';
    return res.end();
  }

  // Handle different resources
  switch (req.url) {
    case "/co2":
      respond(res, {'co2': utils.randomInt(0, 1000)});
      break;
    case "/temp":
      respond(res, {'temp': utils.randomInt(0, 80)});
      break;
    default:
      respond(res);
  }
// Start server
}).listen(port, () => {
  console.log("CoAP server started on port %s", port)
});

// Send JSON content or reply with 404
function respond (res, content) {
  if (content) {
    res.setOption('Content-Format', 'application/json');
    res.code = '2.05';
    res.end(JSON.stringify(content));
  } else {
    res.code = '4.04';
    res.end();
  }
}
