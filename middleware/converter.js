"use strict";

let msgpack = require("msgpack5")(),
  encode = msgpack.encode,
  json2html = require("node-json2html");

module.exports = () => {
  return (req, res, next) => {
    console.info("Representation converter middleware called!");

    // Check for previous middleware result
    if (req.result) {

      // Simple JSON to HTML transformation if requested
      if (req.accepts("html")) {
        console.info("HTML representation selected!");

        let transform = {'tag': 'div', 'html': '${name} : ${value}'};
        res.send(json2html.transform(req.result, transform));
        return;
      }

      if (req.accepts("json")) {
        console.info("JSON representation selected!");
        res.send(req.result);
        return;
      }

      // MessagePack encoding if requested
      if (req.accepts("application/x-msgpack")) {
        console.info("MessagePack representation selected!");
        res.type("application/x-msgpack");
        res.send(encode(req.result));
        return;
      }

      console.info("Defaulting to JSON representation!");
      res.send(req.result);
      return;
    } else {
      next();
    }
  }
};
