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

    this.state = {
      currentView: (
        !props.chartDataLoading && !props.chartDataLoaded ? "wizard" : "chart"
      )
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.chartDataLoading) {
      this.setState({ currentView: "chart" });
    }

    // add more cases here for new view
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
      // wizard
      wizardSetupIndicators,
      wizardSetupCountries,
      wizardSetupErrorMessage,
      wizardSetupLoaded,
      wizardSelectionsMessage,
      selectedIndicators,
      selectedCountries,
      selectedRegions,
      selectedChart,
      wizardBuildAllowed,

      // chart
      chartData,
      chartDataLoaded,
      chartDataLoading,
      selectedViewChart,

      // actions
      wizardClickSelectIndicator,
      wizardClickSelectCountry,
      wizardClickSelectAllCountries,
      wizardClickSelectChart,
      chartRequestData
    } = this.props;

    const {
      currentView
    } = this.state;

    return (
      <div>

        {currentView === "wizard" &&
          wizardSetupLoaded &&
          <WizardView
            indicatorSetup={wizardSetupIndicators}
            countriesSetup={wizardSetupCountries}
            clickSelectIndicator={wizardClickSelectIndicator}
            clickSelectCountry={wizardClickSelectCountry}
            clickSelectAllCountries={wizardClickSelectAllCountries}
            clickSelectChart={wizardClickSelectChart}
            selectedIndicators={selectedIndicators}
            selectedChart={selectedChart}
            selectedCountries={selectedCountries}
            selectedRegions={selectedRegions}
            selectionsMessage={wizardSelectionsMessage}
            buildAllowed={wizardBuildAllowed}
            requestData={chartRequestData}
          />}
        {currentView === "chart" &&
          <ChartView
            dataLoading={chartDataLoading}
            dataLoaded={chartDataLoaded}
            data={chartData}
            selectedViewChart={selectedViewChart}
          />}
      </div>
    );
  }
}

// Visualize.PropTypes = {
// };

function mapStateToProps(state) {
  let { visualize } = state;

  const wizardSetupLoaded = visualize.get("wizardSetupLoaded");
  const wizardSetupLoading = visualize.get("wizardSetupLoading");
  const wizardSetupError = visualize.get("wizardSetupError");
  const wizardSetupErrorMessage = visualize.get("wizardSetupErrorMessage");
  const wizardSetupIndicators = visualize.get("wizardSetupIndicators");
  const wizardSetupCountries = visualize.get("wizardSetupCountries");
  const wizardSelectionsMessage = visualize.get("wizardSelectionsMessage");
  const wizardBuildAllowed = visualize.get("wizardBuildAllowed");
  const chartDataLoaded = visualize.get("chartDataLoaded");
  const chartDataLoading = visualize.get("chartDataLoading");
  const chartData = visualize.get("chartData");
  const chartDataInitial = visualize.get("chartDataInitial");
  const currentYearView = visualize.get("currentYearView");
  const selectedIndicators = visualize.get("selectedIndicators");
  const selectedCountries = visualize.get("selectedCountries");
  const selectedRegions = visualize.get("selectedRegions");
  const selectedChart = visualize.get("selectedChart");
  const selectedViewChart = visualize.get("selectedViewChart");
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
    wizardSelectionsMessage,
    wizardBuildAllowed,
    chartDataLoaded,
    chartDataLoading,
    chartData,
    chartDataInitial,
    currentYearView,
    selectedIndicators,
    selectedCountries,
    selectedRegions,
    selectedChart,
    selectedViewChart,
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
