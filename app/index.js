"use strict";

import express from "express";
import kraken from "kraken-js";
let options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
  onconfig: function(config, next) {
    // Add any additional config setup or overrides here. `config` is an initialized

    // start, sync the database with models
    // call next to continue setting up middleware
    var model = require("./models");
    model.init(config.get("database"));
    model
      .getModel()
      .sequelize.sync()
      .then(() => {
        console.log("API ===> 💾  Database Synced -- Success");
        // Make sure to call next to move on
        next(null, config);
      })
      .catch(err => {
        console.log("API ===> 🆘 💾  Database Setup Error: " + err.message);
      });
  }
};

app = module.exports = express();

/**
 * NOTICE!!!
 * 
 * This enables CORS
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,REPORT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(kraken(options));
app.on("start", function() {
  if (app.kraken.get("env:env") === "production") {
    console.log("API ===> 🌐  Using Production Environment");
  } else {
    console.log("API ===> 🚧  Using Development Environment");
  }
  console.log("API ===> ✅  API Server is ready to serve requests.");
});
