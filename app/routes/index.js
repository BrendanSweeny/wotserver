"use strict";

var path = process.cwd();

module.exports = routes;

function routes (app) {
  app.route('/')
    .get(function (req, res) {
      res.status(200).sendFile(path + '/public/index.html');
    })
}
