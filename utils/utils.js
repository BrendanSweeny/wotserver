"use strict";

let resources = require("../resources/model");

exports.randomInt = (low, high) => {
  return Math.floor(Math.random() * (high - low + 1) + low);
};
