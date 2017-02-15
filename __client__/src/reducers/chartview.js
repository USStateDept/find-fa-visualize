import {
  GET_SETUP,
  GET_SETUP_SUCCESS,
  SELECT_SETUP,
  DESELECT_SETUP,
  SET_BUILD_CHART,
  REQUEST_DATA,
  REQUEST_DATA_SUCCESS,
  SET_CURRENT_YEAR,
  MODAL_TOGGLE,
  REQUEST_GEOJSON,
  RECIEVE_GEOJSON,
  ENABLE_BUILD,
  DESELECT_ALL,
  SAVE_VIZ,
  SAVE_VIZ_COMPLETE,
  REQUEST_AVERAGES,
  RECIEVE_AVERAGES,
  TOGGLE_AVERAGE,
  START_PLAYING,
  PAUSE_PLAYING,
  ENABLE_UNBUILD,
  SET_MAPTYPE
} from "../actions/visualize";

/**
 * Initial State
 * 
 */
const initialState = {
  setupLoaded: false, // got setup from server
  dataLoaded: false, // got data from server
  dataLoading: false, // requested and waiting for data
  currentYearView: false,
  categories: [], // the loading of the menu
  countries: [],
  selectedIndicators: [], // user setup choices
  selectedCountries: [],
  selectedRegions: [],
  selectedChart: "",
  buildChart: "", // the chart being used for build & on the fly changes
  data: {}, // data used to draw current viz
  dataResults: {}, // data that came directly from server
  showModal: true, // used for toggling the vizualization modal
  buildReady: false,
  buildMessage: "",
  geoIsLoading: false,
  geoLoaded: false,
  geoJson: undefined,
  savingViz: false,
  vizSaved: false,
  savedVizID: undefined,
  playing: false,
  averagesLoading: false,
  averagesLoaded: false,
  averagesData: {
    population: null,
    gdp: null,
    equal: null
  },
  mapType: null
};

/**
 * Visualize Reducer Composition
 * 
 */
function toggleAverage(data, averageData, averageType) {
  // stub
}

/**
 * Visualize Reducer
 * 
 */
export default function visualize(state = initialState, action) {
  switch (action.type) {
    case GET_SETUP:
      return {
        ...state,
        setupLoading: true
      };
    case GET_SETUP_SUCCESS:
      return {
        ...state,
        setupLoading: false,
        setupLoaded: true,
        countries: action.setup.countries,
        categories: action.setup.categories
      };
    case SELECT_SETUP:
      if (action.setType === "indicators") {
        return {
          ...state,
          selectedIndicators: state.selectedIndicators.concat(action.name)
        };
      }
      if (action.setType === "countries") {
        return {
          ...state,
          selectedCountries: state.selectedCountries.concat(action.name)
        };
      }
      if (action.setType === "regions") {
        return {
          ...state,
          selectedRegions: state.selectedRegions.concat(action.name)
        };
      }
      if (action.setType === "chart") {
        return {
          ...state,
          selectedChart: action.name
        };
      }
      return state;
    case DESELECT_SETUP:
      if (action.setType === "indicators") {
        return {
          ...state,
          selectedIndicators: state.selectedIndicators.filter(
            (_, i) => i !== action.index
          )
        };
      } else if (action.setType === "countries") {
        return {
          ...state,
          selectedCountries: state.selectedCountries.filter(
            (_, i) => i !== action.index
          )
        };
      } else if (action.setType === "regions") {
        return {
          ...state,
          selectedRegions: state.selectedRegions.filter(
            (_, i) => i !== action.index
          )
        };
      } else if (action.setType === "chart") {
        return {
          ...state,
          selectedChart: ""
        };
      } else {
        return { ...state };
      }
    case DESELECT_ALL:
      return {
        ...state,
        selectedCountries: [],
        selectedIndicators: [],
        selectedChart: ""
      };
    case SET_BUILD_CHART:
      return {
        ...state,
        buildChart: action.chart,
        selectedChart: action.chart
      };
    case REQUEST_DATA:
      return {
        ...state,
        dataLoading: true,
        dataLoaded: false,
        showModal: false,
        currentYearView: false,
        data: {}
      };
    case REQUEST_DATA_SUCCESS:
      return {
        ...state,
        dataLoading: false,
        dataLoaded: true,
        data: action.data,
        dataResults: action.dataResults,
        vizSaved: false, // data changed
        savedVizID: undefined
      };
    case SET_CURRENT_YEAR:
      return {
        ...state,
        currentYearView: action.year
      };
    case SET_MAPTYPE:
      return {
        ...state,
        mapType: action.mapType
      };
    case REQUEST_GEOJSON:
      return {
        ...state,
        geoIsLoading: true
      };
    case RECIEVE_GEOJSON:
      return {
        ...state,
        geoIsLoading: false,
        geoLoaded: true,
        geoJson: action.geoJson
      };
    case MODAL_TOGGLE:
      return {
        ...state,
        showModal: action.showModal
      };
    case ENABLE_BUILD:
      return {
        ...state,
        buildReady: action.value,
        buildMessage: action.message
      };
    case SAVE_VIZ:
      return {
        ...state,
        savingViz: true,
        vizSaved: false,
        savedVizID: undefined
      };
    case SAVE_VIZ_COMPLETE:
      return {
        ...state,
        savingViz: false,
        vizSaved: true,
        savedVizID: action.id
      };
    case REQUEST_AVERAGES:
      return {
        ...state,
        averagesLoading: true
      };
    case RECIEVE_AVERAGES:
      return {
        ...state,
        averagesLoading: false,
        averagesLoaded: true,
        averagesData: {
          population: action.data.population,
          gdp: action.data.gdp,
          equal: action.data.equal
        }
      };
    case TOGGLE_AVERAGE:
      return {
        ...state,
        data: toggleAverage(
          state.data,
          state.averagesData[action.spec],
          action.spec
        )
      };
    case START_PLAYING:
      return {
        ...state,
        playing: true
      };
    case PAUSE_PLAYING:
      return {
        ...state,
        playing: false
      };

    case ENABLE_UNBUILD:
      return initialState;

    default:
      return state;
  }
}
