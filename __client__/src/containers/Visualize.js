import React, { Component } from "react";
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
      currentView: props.currentView || "wizard" // default: "wizard", options: ["wizard", "chart"]
    };
  }

  componentWillMount() {
    // always fetch setup, if not done already, for wizard build process
    // this.props.fetchSetupIfNeeded();
  }

  componentWillUnmount() {
    // this.props.resetAllFields();
  }

  render() {
    // const {
    //   dataLoaded,
    //   dataLoading,
    //   displayModal,
    //   buildChart,
    //   data,
    //   showModal
    // } = this.props;

    const {
      currentView
    } = this.state;

    return (
      <div>
        {currentView === "wizard" && <WizardView />}
        {currentView === "chart" && <ChartView />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  let { visualize } = state;

  const setupLoaded = visualize.get("setupLoaded");
  const dataLoaded = visualize.get("dataLoaded");
  const dataLoading = visualize.get("dataLoading");
  const currentYearView = visualize.get("currentYearView");
  const categories = visualize.get("categories");
  const countries = visualize.get("countries");
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
    setupLoaded,
    dataLoaded,
    dataLoading,
    currentYearView,
    categories,
    countries,
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
