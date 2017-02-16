import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as VisualizeActions from "../actions/visualize";

import WizardView from "../components/visualize/wizardview";
import ChartView from "../components/visualize/chartview";

/**
 * Container component incorporating the wizard build process and the chart viewing
 *
 * @container-component Visualize
 */
class Visualize extends Component {
  constructor(props) {
    super(props);

    let view = props.userSelectedView === "wizard"
      ? "wizard"
      : !props.dataLoading && !props.dataLoaded ? "wizard" : "chart";

    this.state = {
      currentView: view
    };
  }

  componentWillMount() {
    // action to request required data for wizard menu
    this.props.requestWizardSetupIfNeeded();
  }

  componentWillUnmount() {
    // this.props.resetAllFields();
  }

  render() {
    const {
      wizardSetupIndicators,
      wizardSetupCountries,
      wizardSetupErrorMessage,
      wizardSetupLoaded
    } = this.props;

    const {
      currentView
    } = this.state;

    return (
      <div>
        {"HERR => " + wizardSetupErrorMessage}
        {currentView === "wizard" &&
          wizardSetupLoaded &&
          <WizardView
            indicatorSetup={wizardSetupIndicators}
            countrySetup={wizardSetupCountries}
          />}
        {currentView === "chart" && <ChartView />}
      </div>
    );
  }
}

// Visualize.PropTypes = {
// };

function mapStateToProps(state) {
  let { visualize } = state;

  const userSelectedView = visualize.get("userSelectedView");
  const wizardSetupLoaded = visualize.get("wizardSetupLoaded");
  const wizardSetupLoading = visualize.get("wizardSetupLoading");
  const wizardSetupError = visualize.get("wizardSetupError");
  const wizardSetupErrorMessage = visualize.get("wizardSetupErrorMessage");
  const wizardSetupIndicators = visualize.get("wizardSetupIndicators");
  const wizardSetupCountries = visualize.get("wizardSetupCountries");
  const dataLoaded = visualize.get("dataLoaded");
  const dataLoading = visualize.get("dataLoading");
  const currentYearView = visualize.get("currentYearView");
  const selectedIndicators = visualize.get("selectedIndicators");
  const selectedCountries = visualize.get("selectedCountries");
  const selectedRegions = visualize.get("selectedRegions");
  const selectedChart = visualize.get("selectedChart");
  const buildChart = visualize.get("buildChart");
  const data = visualize.get("data");
  const dataResults = visualize.get("dataResults");
  const buildReady = visualize.get("buildReady");
  const buildMessage = visualize.get("buildMessage");
  const geoIsLoading = visualize.get("geoIsLoading");
  const geoLoaded = visualize.get("geoLoaded");
  const geoJson = visualize.get("geoJson");
  const averagesLoading = visualize.get("averagesLoading");
  const averagesLoaded = visualize.get("averagesLoaded");
  const averagesData = visualize.get("averagesData");
  const mapType = visualize.get("mapType");

  return {
    wizardSetupLoaded,
    wizardSetupLoading,
    wizardSetupError,
    wizardSetupErrorMessage,
    wizardSetupIndicators,
    wizardSetupCountries,
    dataLoaded,
    dataLoading,
    currentYearView,
    selectedIndicators,
    selectedCountries,
    selectedRegions,
    selectedChart,
    buildChart,
    data,
    dataResults,
    buildReady,
    buildMessage,
    geoIsLoading,
    geoLoaded,
    geoJson,
    averagesLoading,
    averagesLoaded,
    averagesData,
    mapType
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(VisualizeActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Visualize);
