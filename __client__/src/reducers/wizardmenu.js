import {
    GET_SETUP, GET_SETUP_SUCCESS, SELECT_SETUP, DESELECT_SETUP, SET_BUILD_CHART,
    ENABLE_BUILD, DESELECT_ALL, ENABLE_UNBUILD
} from '../actions/wizardmenu';

const initialState = {
    setupLoaded: false,  // got setup from server
    categories: [],  // the loading of the menu
    countries: [],
    selectedIndicators: [], // user setup choices 
    selectedCountries: [],
    selectedRegions: [],
    selectedChart: '',
    buildChart: '',
    buildReady: false,
    buildMessage: '',
};

/**
 * WizardMenu Reducer
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
            if (action.setType === 'indicators') {
                return {
                    ...state,
                    selectedIndicators: state.selectedIndicators.concat(action.name)
                };
            }
            if (action.setType === 'countries') {
                return {
                    ...state,
                    selectedCountries: state.selectedCountries.concat(action.name)
                };
            }
            if (action.setType === 'regions') {
                return {
                    ...state,
                    selectedRegions: state.selectedRegions.concat(action.name)
                };
            }
            if (action.setType === 'chart') {
                return {
                    ...state,
                    selectedChart: action.name
                };
            }
            return state;
        case DESELECT_SETUP:
            if (action.setType === 'indicators') {
                return {
                    ...state,
                    selectedIndicators: state.selectedIndicators.filter((_, i) => i !== action.index)
                };
            }
            else if (action.setType === 'countries') {
                return {
                    ...state,
                    selectedCountries: state.selectedCountries.filter((_, i) => i !== action.index)
                };
            }
            else if (action.setType === 'regions') {
                return {
                    ...state,
                    selectedRegions: state.selectedRegions.filter((_, i) => i !== action.index)
                };
            }
            else if (action.setType === 'chart') {
                return {
                    ...state,
                    selectedChart: ''
                };
            }
            else {
                return { ...state };
            }
        case DESELECT_ALL:
            return {
                ...state,
                selectedCountries: [],
                selectedIndicators: [],
                selectedChart: ''
            };
        case SET_BUILD_CHART:
            return {
                ...state,
                buildChart: action.chart,
                selectedChart: action.chart
            };
        case ENABLE_BUILD:
            return {
                ...state,
                buildReady: action.value,
                buildMessage: action.message
            };
        case ENABLE_UNBUILD:
            return initialState;
        default:
            return state;
    }
}

