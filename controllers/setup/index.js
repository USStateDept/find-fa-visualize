/**
 * Setup API Endpoint
 *
 * Provide base data such as categories, indicators, countries
 */
"use strict";

import routerFunctions from "./router/";

module.exports = router => {
  /**
   *  @route /setup/indicators
   *
   *  @GET
   *  Gets all indicator data and information
   */
  router.route("/indicators").get(routerFunctions.getIndicators);

  /**
   *  @route /setup/setupForBuildMenu
   *  
   *  @GET
   *  Gets compiled setup of category-nested indicators and countries & regions
   */
  router.route("/setupForBuildMenu").get(routerFunctions.getBuildMenuSetup);

  /**
   *  @route /setup/setupForIngestMenu
   *
   *  @GET
   *  Gets compiled setup of category-nested indicators for data-ingestion menu 
   */
  router.route("/setupForIngestMenu").get(routerFunctions.getIngestMenuSetup);

  /**
   *  @route /setup/geojson/:type
   *
   *  @GET
   *  Gets a geojson file given a specific region type
   */
  router.route("/geojson/:type").get(routerFunctions.getGeojson);
};
