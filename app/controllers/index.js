"use strict";
var IndexModel = require("../models/index");

module.exports = function(router) {
  router.get("/", function(req, res) {
    res.render("FIND/FA Visaulize API");
  });
};
