"use strict";
var IndexModel = require("../models/index");

module.exports = function(router) {
  router.get("/", function(req, res) {
    res.send("FIND/FA Visaulize API");
  });
};
