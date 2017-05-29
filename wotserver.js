"use strict";

let httpServer = require("./servers/http"),
  resources = require("./resources/model");

let server = httpServer.listen(resources.pi.port, () => {
  console.info("Your WoT Pi is up and running on port %s", resources.pi.port);
})
