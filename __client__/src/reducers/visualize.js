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
  WIZARD_RESET,
  // data actions
  REQUEST_DATA,
  REQUEST_DATA_SUCCESS,
  REQUEST_DATA_FAILURE,
  REQUEST_AVERAGES,
  REQUEST_AVERAGES_SUCCESS,
  REQUEST_AVERAGES_FAILURE,
  REQUEST_GEOJSON,
  REQUEST_GEOJSON_SUCCESS,
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
  userSelectedView: "", // nothing at first, but a user can edit builds by choosing to see wizard
  wizardSetupLoaded: false, // got setup from server
  wizardSetupLoading: false,
  wizardSetupError: false,
  wizardSetupErrorMessage: "",
  wizardSetupCountries: List([]), // the loading of the menu
  wizardSetupIndicators: List([]),
  dataLoaded: false, // got data from server
  dataLoading: false, // requested and waiting for data
  currentYearView: false,
  selectedIndicators: List([]), // user setup choices
  selectedCountries: List([]),
  selectedRegions: List([]),
  selectedChart: "",
  buildChart: "", // the chart being used for build & on the fly changes
  data: Map({}), // data used to draw current viz
  dataResults: Map({}), // data that came directly from server
  buildReady: false,
  buildMessage: "",
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
    case WIZARD_SELECT_SETUP: {
      if (action.setType !== "chart") {
        let key = action.setType.charAt(0).toUpperCase() +
          action.setType.slice(1);
        return state.set(
          `selected${key}`,
          state[`selected${key}`].push(action.name)
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
          state[`selected${key}`].delete(
            state.state[`selected${key}`].find(action.name)
          )
        );
      }
      if (action.setType === "chart") {
        return state.set("selectedChart", "");
      }
    }
    case WIZARD_SELECT_CHART:
      return state.withMutations(s => {
        s.set("buildChart", action.chart).set("selectedChart", action.chart);
      });
    case WIZARD_TRY_ENABLE_BUILD:
      return state.withMutations(s => {
        s.set("buildReady", action.value).set("buildMessage", action.message);
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
    case REQUEST_DATA:
      return state.withMutations(s => {
        s
          .set("dataLoading", true)
          .set("dataLoaded", false)
          .set("showModal", false)
          .set("currentYearView", false)
          .set("data", Map({}));
      });
    case REQUEST_DATA_SUCCESS:
      return state.withMutations(s => {
        s
          .set("dataLoading", false)
          .set("dataLoaded", true)
          .set("data", action.data)
          .set("dataResults", action.dataResults);
      });
    case REQUEST_DATA_FAILURE:
      return state.withMutations(s => {
        s
          .set("dataLoading", false)
          .set("dataLoaded", false)
          .set("dataLoadError", true);
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
