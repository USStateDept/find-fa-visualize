import fetch from "isomorphic-fetch";
import _ from "lodash";

import Parse from "./utils/plotlyParse";
import AverageFactory from "./utils/averageFactory";
import BuildGate from "./utils/buildGate";

//
// Actions
//
// Constants, String literals representing actions happeing in the apply.
// An action can be any ui interation or events such as data loading.
// The naming shpuld be pretty descriptive and match up with what our UI is doing.
//

// setup actions
export const REQUEST_SETUP = "REQUEST_SETUP";
export const REQUEST_SETUP_SUCCESS = "REQUEST_SETUP_SUCCESS";
export const REQUEST_SETUP_FAILURE = "REQUEST_SETUP_FAILURE";
// wizard ui actions
export const WIZARD_SELECT_SETUP_INIT = "WIZARD_SELECT_SETUP_INIT";
export const WIZARD_SELECT_SETUP = "WIZARD_SELECT_SETUP";
export const WIZARD_DESELECT_SETUP = "WIZARD_DESELECT_SETUP";
export const WIZARD_SELECT_CHART = "WIZARD_SELECT_CHART";
export const WIZARD_SET_GEOJSON_MAPTYPE = "WIZARD_SET_GEOJSON_MAPTYPE";
export const WIZARD_TRY_ENABLE_BUILD = "WIZARD_TRY_ENABLE_BUILD";
export const WIZARD_RESET = "WIZARD_RESET";
// data actions
export const REQUEST_CHART_DATA = "REQUEST__CHART_DATA";
export const REQUEST_CHART_DATA_SUCCESS = "REQUEST_CHART_DATA_SUCCESS";
export const REQUEST_CHART_DATA_FAILURE = "REQUEST_CHART_DATA_FAILURE";
export const REQUEST_AVERAGES = "REQUEST_AVERAGES";
export const REQUEST_AVERAGES_SUCCESS = "REQUEST_AVERAGES_SUCCESS";
export const REQUEST_AVERAGES_FAILURE = "REQUEST_AVERAGES_FAILURE";
export const REQUEST_GEOJSON = "REQUEST_GEOJSON";
export const REQUEST_GEOJSON_SUCCESS = "REQUEST_GEOJSON_SUCCESS";
// chart actions
export const CHART_SET_YEAR = "CHART_SET_YEAR";
export const SET_BUILD_CHART = 'SET_BUILD_CHART';
// overall state
export const TOTAL_UNBUILD = "TOTAL_UNBUILD";
// data actions
export const REQUEST_DATA = 'REQUEST_DATA';
export const REQUEST_DATA_SUCCESS = 'REQUEST_DATA_SUCCESS';

//
// Action Creators Dispatchers
//
// Functions that return an object with a persistant key of "type" which is always an action,
// as well as an optional body of data needed for updates and changes in the state.
//

// actions to be dispatched to reducer
// Create our Action Types

// actions to be dispatched
function requestData() {
  return {
    type: REQUEST_DATA
  };
}

function receiveData(data, original) {
  return {
    type: REQUEST_DATA_SUCCESS,
    data: data,
    dataResults: original
  };
}

function setBuildChart(chart) {
  return {
    type: SET_BUILD_CHART,
    chart: chart
  };
}

function dispatchRequestWizardSetup() {
  return {
    type: REQUEST_SETUP
  };
}

function dispatchRequestWizardSetupSuccess(json) {
  return {
    type: REQUEST_SETUP_SUCCESS,
    countriesSetup: json.countriesSetup,
    indicatorSetup: json.indicatorSetup
  };
}

function dispatchRequestWizardSetupFailure(json) {
  return {
    type: REQUEST_SETUP_FAILURE,
    message: json.message
  };
}

function dispatchWizardSelectInit(optionType) {
  return {
    type: WIZARD_SELECT_SETUP_INIT,
    optionType: optionType
  };
}

function dispatchWizardSelect(value, setType) {
  return {
    type: WIZARD_SELECT_SETUP,
    setType: setType,
    name: value
  };
}

function dispatchWizardDeselect(value, setType, index) {
  return {
    type: WIZARD_DESELECT_SETUP,
    setType: setType,
    value: value,
    index: index
  };
}

function dispatchWizardSetChart(chart) {
  return {
    type: WIZARD_SELECT_CHART,
    chart: chart
  };
}

function dispatchWizardSetGeojsonMaptype(type) {
  return {
    type: WIZARD_SET_GEOJSON_MAPTYPE,
    mapType: type
  };
}

function dispatchWizardTryEnableBuild(result) {
  return {
    type: WIZARD_TRY_ENABLE_BUILD,
    value: result.allow,
    message: result.message
  };
}

function dispatchWizardReset() {
  return {
    type: WIZARD_RESET
  };
}

function dispatchRequestVisualizeData() {
  return {
    type: REQUEST_CHART_DATA
  };
}

function dispatchRequestVisualizeDataSuccess(data, original) {
  return {
    type: REQUEST_CHART_DATA_SUCCESS,
    data: data,
    chartDataInitial: original
  };
}

function dispatchRequestVisualizeDataFailure(json) {
  return {
    type: REQUEST_CHART_DATA_FAILURE,
    message: json.message
  };
}

function dispatchRequestAverageData() {
  return {
    type: REQUEST_AVERAGES
  };
}

function dispatchRequestAverageDataSuccess(data) {
  return {
    type: REQUEST_AVERAGES_SUCCESS,
    data: data
  };
}

function dispatchRequestAverageDataFailure(data) {
  return {
    type: REQUEST_AVERAGES_FAILURE,
    data: data
  };
}

function dispatchRequestGeojson() {
  return {
    type: REQUEST_GEOJSON
  };
}

function dispatchRequestGeojsonSuccess(json) {
  return {
    type: REQUEST_GEOJSON_SUCCESS,
    geoJson: json
  };
}

function dispatchSetVisualizeYear(year) {
  return {
    type: CHART_SET_YEAR,
    year: year
  };
}

//
// Action Creators
//
// Functions that perfom actual functionality to generate change in the state of our app
//

const APIURL = process.env.API_URL || "http://localhost:3010";

export function wizardClickSelectIndicator(indicator) {
  return (dispatch, getState) => {
    // determine if indicator is selected or not already
    let index = getState().visualize
      .get("selectedIndicators")
      .findIndex(ind => ind.equals(indicator));

    if (index === -1) {
      dispatch(dispatchWizardSelect(indicator, "indicators"));
    } else {
      dispatch(dispatchWizardDeselect(indicator, "indicators", index));
    }
    if (!getState().visualize.get("wizardIndicatorSelectInit")) {
      dispatch(dispatchWizardSelectInit("Indicator"));
    }
    dispatch(
      dispatchWizardTryEnableBuild(
        BuildGate.checkBuildReady(getState().visualize)
      )
    );
  };
}

// build menu select country
export function wizardClickSelectCountry(country) {
  return (dispatch, getState) => {
    let index = getState().visualize
      .get("selectedCountries")
      .findIndex(cty => cty.equals(country));

    if (index === -1) {
      dispatch(dispatchWizardSelect(country, "countries"));
    } else {
      dispatch(dispatchWizardDeselect(country, "countries", index));
    }
    if (!getState().visualize.get("wizardCountrySelectInit")) {
      dispatch(dispatchWizardSelectInit("Country"));
    }
    dispatch(
      dispatchWizardTryEnableBuild(
        BuildGate.checkBuildReady(getState().visualize)
      )
    );
  };
}

// build menu select region
export function wizardClickSelectRegion(region) {
  return (dispatch, getState) => {
    let index = getState().visualize
      .get("selectedRegions")
      .findIndex(reg => region.equals(region));

    if (index === -1) {
      dispatch(dispatchWizardSelect(region, "regions"));
    } else {
      dispatch(dispatchWizardDeselect(region, "regions", index));
    }
    if (!getState().visualize.get("wizardCountrySelectInit")) {
      dispatch(dispatchWizardSelectInit("Country"));
    }
    dispatch(
      dispatchWizardTryEnableBuild(
        BuildGate.checkBuildReady(getState().visualize)
      )
    );
  };
}

export function wizardClickSelectAllFromRegion(region) {
  return (dispatch, getState) => {
    // foreach in countries, select country if it has
    getState().visualize
      .get("wizardSetupCountries")
      .get(0)
      .get("list")
      .map(country => {
        // check the cty object and see if it contains the region
        if (country.get(region.get("Type")) === region.get("Name")) {
          dispatch(wizardClickSelectCountry(country));
        }
      });
    dispatch(
      dispatchWizardTryEnableBuild(BuildGate.checkBuildReady(getState().visualize))
    );
  };
}

// build menu select chart
export function wizardClickSelectChart(chart) {
  return (dispatch, getState) => {
    // there can be only one chart
    // in the reducer make sure you just replace it
    if (getState().visualize.get("selectedChart") !== chart) {
      dispatch(dispatchWizardDeselect(null, "chart", null));
      dispatch(dispatchWizardSelect(chart, "chart"));
    } else {
      dispatch(dispatchWizardDeselect(null, "chart", null));
    }
    if (!getState().visualize.get("wizardChartSelectInit")) {
      dispatch(dispatchWizardSelectInit("Chart"));
    }
    dispatch(
      dispatchWizardTryEnableBuild(
        BuildGate.checkBuildReady(getState().visualize)
      )
    );
  };
}

// on-the-fly chart change
export function chartLiveChartTypeChange(chart) {
  return dispatch => {
    // there can be only one chart
    // in the reducer make sure you just replace it
    dispatch(dispatchWizardSetChart(chart));
  };
}

// select all countries
export function wizardClickSelectAllCountries() {
  return (dispatch, getState) => {
    getState().visualize
      .get("wizardSetupCountries")
      .get(0)
      .get("list")
      .map(country => {
        dispatch(wizardClickSelectCountry(country));
      });
  };
}

// reset all fields
export function resetAllFields() {
  return (dispatch, getState) => {
    dispatch(dispatchWizardReset());
    dispatch(
      dispatchWizardTryEnableBuild(BuildGate.checkBuildReady(getState().visualize))
    );
  };
}

// action creator functionality
function requestWizardSetup() {
  return dispatch => {
    dispatch(dispatchRequestWizardSetup());

    return fetch(`${APIURL}/setup/setupForWizardMenu`)
      .then(response => response.json())
      .then(json => {
        dispatch(dispatchRequestWizardSetupSuccess(json));
      })
      .catch(error => {
        console.log(error);
        dispatch(dispatchRequestWizardSetupFailure(error));
      });
  };
}

// action creator
export function requestWizardSetupIfNeeded() {
  return (dispatch, getState) => {
    // No need to call the external API if data is already in memory:
    if (getState().visualize.get("wizardSetupLoaded")) {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve();
    } else {
      return dispatch(requestWizardSetup());
    }
  };
}

// action creator functionality
export function fetchGeoJson(type) {
  // thunk middleware knows how to handle functions
  return (dispatch, getState) => {
    dispatch(dispatchRequestGeojson());
    // Return a promise to wait for
    return fetch(`api/setup/geojson/${type}`)
      .then(response => response.json())
      .then(json => {
        dispatch(dispatchRequestGeojsonSuccess(json));
      });
  };
}

export function dispatchWizardSetGeojsonMaptypeForGeojson(type) {
  return dispatch => {
    dispatch(
      dispatchWizardSetGeojsonMaptype(
        (() => {
          switch (type) {
            case "All":
              return "world";
            case "Continent":
              return "continent";
            case "Department of Defense":
              return "dod";
            case "Department of State":
              return "dos";
            case "Income Group":
              return "income";
            case "United States Agency for International Development":
              return "usaid";
            default:
              return "world";
          }
        })()
      )
    );
  };
}

// we recieved a saved setup, now we need to go and select all for that setup
function selectAllForSavedViz(setup) {
  return (dispatch, getState) => {
    // select all countries
    _.forEach(setup.countries, country => {
      dispatch(dispatchWizardSelect(country, "countries"));
    });
    // select all the indicators
    _.forEach(setup.indicators, indicator => {
      dispatch(dispatchWizardSelect(indicator, "indicators"));
    });
    // select the chart
    dispatch(dispatchWizardSelect(setup.chart, "chart"));

    // finally after all selection, dispatch build ready
    dispatch(
      dispatchWizardTryEnableBuild(BuildGate.checkBuildReady(getState().visualize))
    );
  };
}

// action functionality/creator/performer
export function chartRequestData() {
  return (dispatch, getState) => {
    const state = getState().visualize;
    const selectedIndicators = state.get("selectedIndicators");
    const selectedCountries = state.get("selectedCountries");
    const selectedRegions = state.get("selectedRegions");
    const selectedChart = state.get("selectedChart");

    dispatch(dispatchRequestVisualizeData());
    dispatch(dispatchWizardSetChart(selectedChart));

    // Return a promise to wait for
    return fetch(`${APIURL}/visualize/data`, {
      method: "REPORT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        indicators: selectedIndicators,
        countries: selectedCountries,
        regions: selectedRegions,
        chart: selectedChart
      })
    })
      .then(response => response.json())
      .then(json => {
        var data = json[0];
        let parse = new Parse(data);
        let nullData = parse.nullValuesDataCheck();
        let chartObjects;
        if (!nullData) {
          chartObjects = data.indicators.length === 1
            ? parse.parseForOne()
            : data.indicators.length === 2
                ? parse.parseForTwo()
                : parse.parseForThree();
        } else {
          chartObjects = false;
        }

        dispatch(dispatchRequestVisualizeDataSuccess(chartObjects, data));
      });
  };
}

 //action functionality/creator/performer
export function buildVizFromSavedID(id) {
  return dispatch => {
    // query for id and get build chart
    fetch(`${APIURL}/visualize/save/` + id, {
      method: 'REPORT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }})
      .then(response => response.json())
      .then(json => {
        // if completed, we need to just build the chart
        if (json.complete) {
          dispatch(selectAllForSavedViz(json.viz_setup));
          let { chart, indicators, regions, countries } = json.viz_setup;
          return dispatch(
            fetchData(indicators, countries, regions, chart)
          );
        } else {
          // select all that apply to build
          // but dont fetch data
          dispatch(selectAllForSavedViz(json.viz_setup));
        }
      });
  };
}

// action functionality/creator/performer
function fetchData(ind, cty, reg, cht ) {
  // thunk middleware knows how to handle functions
  return dispatch => {
    // let component know we are requesting data
    dispatch(requestData());
    // here is where we set our chart to build
    // the build chart
    dispatch(setBuildChart(cht));

    // Return a promise to wait for
    return fetch(`${APIURL}/visualize/data`, {
      method: 'REPORT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        indicators: ind,
        countries: cty,
        regions: reg,
        chart: cht
      })
    })
        .then(response => response.json() )
        .then(json => {
          var data = json[0];
          let parse = new Parse(data);
          let nullData = parse.nullValuesDataCheck();
          let chartObjects;
          if(!nullData) {
            chartObjects = ( 
              data.indicators.length == 1 ? parse.parseForOne() : 
              data.indicators.length == 2 ? parse.parseForTwo() : parse.parseForThree()
            );
          } else {
            chartObjects = false;
          }
         
          dispatch(receiveData(chartObjects, data));
        });
  };
}

export function setAverergeData(type) {
  return (dispatch, getState) => {
    let data = _.cloneDeep(getState().visualize.present.data);
    let originalResults = _.cloneDeep(getState().visualize.present.dataResults);

    // iterate through the averages value and append the averages object
    _.forIn(getState().visualize.present.averagesData[type], function(
      value,
      key
    ) {
      let index = _.findIndex(data.chartData[key].traces, t => {
        if (t) {
          return t.name === value.name;
        } else {
          return false;
        }
      });

      // toggles a particular average value
      if (index === -1) {
        // adds averages to end of data object to be drawn by plotly
        data.chartData[key].traces.push(value);
      } else {
        data.chartData[key].traces.splice(index, 1);
      }
    });

    dispatch(dispatchRequestVisualizeDataSuccess(data, originalResults));
  };
}

function oneIndicatorAverageCheck(indicators) {
  let averageTypesToGet = [];

  _.each(indicators, ind => {
    if (ind.avgEql && averageTypesToGet.indexOf("equal") === -1) {
      averageTypesToGet.push("equal");
    }
    if (ind.avgGdp && averageTypesToGet.indexOf("gdp") === -1) {
      averageTypesToGet.push("gdp");
    }
    if (ind.avgPop && averageTypesToGet.indexOf("population") === -1) {
      averageTypesToGet.push("population");
    }
  });

  return averageTypesToGet;
}

function multipleIndicatorAverageCheck(indicators) {
  let averageTypesToGet = [];

  let getPopulation = true;
  let getGdp = true;
  let getEqual = true;

  _.each(indicators, ind => {
    if (!ind.avgEql) {
      getEqual = false;
    }
    if (!ind.avgGdp) {
      getGdp = false;
    }
    if (!ind.avgPop) {
      getPopulation = false;
    }
  });

  if (getEqual) {
    averageTypesToGet.push("equal");
  }
  if (getGdp) {
    averageTypesToGet.push("gdp");
  }
  if (getPopulation) {
    averageTypesToGet.push("population");
  }

  return averageTypesToGet;
}

export function requestAverageData(types) {
  return (dispatch, getState) => {
    dispatch(dispatchRequestAverageData());

    let country_ids = getState().visualize.present.selectedCountries.map(
      cty => {
        return cty.Country_ID;
      }
    );

    let options = {
      method: "REPORT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ countries: country_ids, types: types }) // body should include country ids
    };

    fetch("api/visualize/averages/weights", options)
      .then(response => response.json())
      .then(json => {
        // init a new average factory
        let af = new AverageFactory(
          json,
          getState().visualize.present.data.chartData,
          getState().visualize.present.selectedIndicators
        );

        let indicatorLength = getState().visualize.present.selectedIndicators.length;

        // average data generation varies based on number of indicators
        let averageData = indicatorLength === 1
          ? af.generateAveragesForOne()
          : indicatorLength === 2
              ? af.generateAveragesForTwo()
              : af.generateAveragesForThree();

        dispatch(dispatchRequestAverageDataSuccess(averageData));
      });
  };
}

export function requestAverageDataIfNeeded() {
  return (dispatch, getState) => {
    let averageTypesToGet;
    let indicators = getState().visualize.present.selectedIndicators;

    if (getState().visualize.present.selectedIndicators.length === 1) {
      averageTypesToGet = oneIndicatorAverageCheck(indicators);
    } else {
      averageTypesToGet = multipleIndicatorAverageCheck(indicators);
    }

    if (averageTypesToGet.length > 0) {
      dispatch(requestAverageData(averageTypesToGet));
    } else {
      dispatch(
        dispatchRequestAverageDataSuccess({
          population: null,
          gdp: null,
          equal: null
        })
      );
    }
  };
}

export function setCurrentViewYear(year) {
  return dispatch => {
    dispatch(dispatchSetVisualizeYear(year));
  };
}
