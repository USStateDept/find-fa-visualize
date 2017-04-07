import Immutable, { Map, List, fromJS } from "immutable";

import {
  // setup actions
  REQUEST_SETUP,
  REQUEST_SETUP_SUCCESS,
  REQUEST_SETUP_FAILURE,
  // wizard ui actions
  WIZARD_SELECT_SETUP,
  WIZARD_DESELECT_SETUP,
  WIZARD_SELECT_CHART,
  WIZARD_TRY_ENABLE_BUILD,
  WIZARD_SET_GEOJSON_MAPTYPE,
  WIZARD_SELECT_SETUP_INIT,
  WIZARD_RESET,
  // data actions
  REQUEST_CHART_DATA,
  REQUEST_CHART_DATA_SUCCESS,
  REQUEST_CHART_DATA_FAILURE,
  REQUEST_AVERAGES,
  REQUEST_AVERAGES_SUCCESS,
  REQUEST_AVERAGES_FAILURE,
  REQUEST_GEOJSON,
  REQUEST_GEOJSON_SUCCESS,
  REQUEST_DATA_SUCCESS,
  // chart actions
  CHART_SET_YEAR,
  // state
  TOTAL_UNBUILD
} from "../actions/visualize";

/**
 * Initial State
 * 
 * Data structure that represents the intial state of the application
 */
const initialState = Map({
  // wizard
  wizardSetupLoaded: false, // got setup from server
  wizardSetupLoading: false,
  wizardSetupError: false,
  wizardSetupErrorMessage: "",
  wizardSetupCountries: List([]), // the loading of the menu
  wizardSetupIndicators: List([]),
  wizardSelectionsMessage: "",
  wizardIndicatorSelectInit: false,
  wizardCountrySelectInit: false,
  wizardChartSelectInit: false,
  wizardBuildAllowed: false,
  // chart visualize

  chartDataInitial: Map({}), // data that came directly from server (un-parsed)
  chartDataLoaded: false, // got data from server
  chartDataLoading: false, // requested and waiting for data
  chartData: Map({}), // data used to draw current viz
  currentYearView: false,
  selectedIndicators: List([]), // user setup choices
  selectedCountries: List([]),
  selectedRegions: List([]),
  selectedChart: "", // chosen in wizard menu
  selectedViewChart: "", // the chart being used for build & on the fly changes

  geoIsLoading: false,
  geoLoaded: false,
  geoJson: undefined,
  averagesLoading: false,
  averagesLoaded: false,
  averagesData: Map({
    population: null,
    gdp: null,
    equal: null
  }),
  mapType: null
});

/**
 * Visualize Reducer
 * 
 * Pure function, backed by immutable.js, that takes a previous state & an action to produce a totally new state
 */
export default function visualize(state = initialState, action) {
  switch (action.type) {
    case REQUEST_SETUP:
      return state.set("wizardSetupLoading", true);
    case REQUEST_SETUP_SUCCESS:
      return state.withMutations(s => {
        s
          .set("wizardSetupLoading", false)
          .set("wizardSetupLoaded", true)
          .set("wizardSetupError", false)
          .set("wizardSetupCountries", fromJS(action.countriesSetup))
          .set("wizardSetupIndicators", fromJS(action.indicatorSetup));
      });
    case REQUEST_SETUP_FAILURE:
      return state.withMutations(s => {
        s
          .set("wizardSetupLoading", false)
          .set("wizardSetupLoaded", false)
          .set("wizardSetupError", true)
          .set("wizardSetupErrorMessage", action.message);
      });
    case WIZARD_SELECT_SETUP_INIT: {
      return state.set(`wizard${action.optionType}SelectInit`, true);
    }
    case WIZARD_SELECT_SETUP: {
      if (action.setType !== "chart") {
        let key = action.setType.charAt(0).toUpperCase() +
          action.setType.slice(1);
        return state.set(
          `selected${key}`,
          state.get(`selected${key}`).push(action.name)
        );
      }
      if (action.setType === "chart") {
        return state.set("selectedChart", action.name);
      }
    }
    case WIZARD_DESELECT_SETUP: {
      if (action.setType !== "chart") {
        let key = action.setType.charAt(0).toUpperCase() +
          action.setType.slice(1);
        return state.set(
          `selected${key}`,
          state.get(`selected${key}`).delete(action.index)
        );
      }
      if (action.setType === "chart") {
        return state.set("selectedChart", "");
      }
    }
    case WIZARD_SELECT_CHART:
      return state.withMutations(s => {
        s
          .set("selectedViewChart", action.chart)
          .set("selectedChart", action.chart);
      });
    case WIZARD_TRY_ENABLE_BUILD:
      return state.withMutations(s => {
        s
          .set("wizardBuildAllowed", action.value)
          .set("wizardSelectionsMessage", action.message);
      });
    case WIZARD_RESET:
      return state.withMutations(s => {
        s
          .set("selectedCountries", List([]))
          .set("selectedIndicators", List([]))
          .set("selectedChart", "");
      });
    case WIZARD_SET_GEOJSON_MAPTYPE:
      return state.set("mapType", action.mapType);
    case REQUEST_CHART_DATA:
      return state.withMutations(s => {
        s
          .set("chartDataLoading", true)
          .set("chartDataLoaded", false)
          .set("showModal", false)
          .set("currentYearView", false)
          .set("chartData", Map({}));
      });
    case REQUEST_CHART_DATA_SUCCESS:
      return state.withMutations(s => {
        s
          .set("chartDataLoading", false)
          .set("chartDataLoaded", true)
          .set("chartData", action.data)
          .set("chartchartDataInitial", action.chartDataInitial);
      });
    case REQUEST_CHART_DATA_FAILURE:
      return state.withMutations(s => {
        s
          .set("chartDataLoading", false)
          .set("chartDataLoaded", false)
          .set("chartDataLoadError", true);
      });
    case CHART_SET_YEAR:
      return state.set("currentYearView", action.year);

    case REQUEST_GEOJSON:
      return state.set("geoIsLoading", true);
    case REQUEST_GEOJSON_SUCCESS:
      return state.withMutations(s => {
        s
          .set("geoIsLoading", false)
          .set("geoLoaded", true)
          .set("geoJson", action.geoJson);
      });

    case REQUEST_DATA_SUCCESS:
      return state.withMutations(s => {
        s
          .set("chartDataLoading", false)
          .set("chartDataLoaded", true)
          .set("chartData", action.data)
          .set("wizardBuildAllowed", true)
          .set("wizardSetupLoaded", true)
          // .set("chartchartDataInitial", action.chartDataInitial);
      });

    case REQUEST_AVERAGES:
      return state.set("averagesLoading", true);
    case REQUEST_AVERAGES_SUCCESS:
      return state.withMutations(s => {
        s
          .set("averagesLoading", false)
          .set("averagesLoaded", true)
          .set("averagesData", {
            population: action.data.population,
            gdp: action.data.gdp,
            equal: action.data.equal
          });
      });
    case REQUEST_AVERAGES_FAILURE:
      return state.withMutations(s => {
        s
          .set("averagesLoading", false)
          .set("averagesLoaded", false)
          .set("averagesLoadError", true);
      });
    case TOTAL_UNBUILD:
      return initialState;
    default:
      return state;
  }
}
