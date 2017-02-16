"use strict";

/**
 * Necessary for future ECMA or non-supported js implimentations like import/export
 */
require("babel-polyfill");
require("babel-register");

let app = require("./index");
let http = require("http");
let server;

// Create and start HTTP server.
server = http.createServer(app);

// Load up the database, start the Server
server.listen(process.env.APIPORT || 3010);
server.on("listening", function() {
  console.log(
    "API ===> 🐙  Express-Kraken Server listening on http://localhost:%d",
    this.address().port
  );
});
