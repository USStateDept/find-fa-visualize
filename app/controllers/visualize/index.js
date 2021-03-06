/**
 * Data Visualization Controller/Routing
 *
 * This is the api used in order to build visualizations on the client-side
 */
"use strict";

import routerFunctions from "./router/";

module.exports = router => {
  /**
   *  /visualize/data
   *
   *  @REPORT
   *  Report method takes a json body. Returns indicator/country data for requested parameters, to be visualized 
   *  Report body is JSON, Key/value pairs consist of country, indicators, and requested to visualize
   */
  router.route("/data").report(routerFunctions.reportData);

  /**
   *  /visualize/data
   *
   *  @REPORT
   *  Report method takes a json body. Returns different average data for indicator/countries
   */
  router.route("/averages").report(routerFunctions.reportAverages);

  /**
   *  /visualize/save/:id
   *
   *  @REPORT
   *
   *  Report method returns a saved visualization
   */
  router.route("/save/:id").report(routerFunctions.getSavedViz);

  /**
   *  /visualize/save
   *
   *  @REPORT
   *
   *  Report method takes a json body that represents a graph visualization
   */
  router.route("/save").report(routerFunctions.postSavedViz);
};
