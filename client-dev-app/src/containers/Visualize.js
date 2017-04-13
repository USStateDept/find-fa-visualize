import React, { Component, PropTypes } from "react";
import { Modal } from 'react-bootstrap';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as VisualizeActions from "../actions/visualize";

import WizardView from "../components/visualize/wizardview";
import ChartView from "../components/visualize/chartview";
import SaveModal from '../components/visualize/chartview/SaveModal';

/**
 * Container component incorporating the wizard build process and the chart viewing
 *
 * @container-component Visualize
 */
class Visualize extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      saveModal: false
    };

    if(process.browser){
      let params  = this.props.location.query;
      if (params.id != undefined) {
        this.setupLoadViz(params.id);
        this.props.buildVizFromSavedID(params.id);
        this.state = {
          currentView: "chart"
        };
      } else {
        this.state = {
          currentView: (
            !props.chartDataLoading && !props.chartDataLoaded ? "wizard" : "chart"
          )
        };
      }
    }

  }

  setupLoadViz(id){
    this.setState({
      fromSavedID: id,
      wizardSetupLoaded: true
    });
  }

  closeSave() {
    this.setState({
      saveModal: false
    });
  }

  initSave() {
    this.setState({
      saveModal: true
    });
  }

  autoSaveShare() {
    this.props.saveVisualization("SHARED URL - NO NAME")
      .then(() => {
        this.setState({saveModal: true});
      });
  }

  saveViz(name) {
    this.props.saveVisualization(name);
  }

  componentWillMount() {

    this.props.requestWizardSetupIfNeeded();
  }

  componentDidMount(){
    // if there was an id, we need to load
    if(this.state.fromSavedID != undefined && this.state.fromSavedID != "") {
      // we have an id and need load that saved viz
      this.props.buildVizFromSavedID(this.state.fromSavedID);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.chartDataLoading) {
      this.setState({ currentView: "chart" });
    }
  }

  componentWillUnmount(){
    this.props.resetAllFields();
    this.props.removeLocaitonQuery();
  }

  changeToWizardView() {
    this.setState({ currentView: "wizard" });
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
      selectedYearRange,
      originalYearRange,
      wizardBuildAllowed,

      // chart
      chartData,
      chartDataLoaded,
      chartDataLoading,
      selectedViewChart,
      savingViz,
      vizSaved,
      savedVizID,

      // actions
      wizardClickSelectIndicator,
      wizardClickSelectCountry,
      wizardClickSelectRegion,
      wizardClickSelectAllFromRegion,
      wizardClickSelectAllCountries,
      wizardClickSelectChart,
      chartRequestData,
      chartLiveChartTypeChange,
      setCurrentViewYear
    } = this.props;

    const {
      currentView,
      saveModal
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
            clickSelectRegion={wizardClickSelectRegion}
            clickSelectAllFromRegion={wizardClickSelectAllFromRegion}
            clickSelectAllCountries={wizardClickSelectAllCountries}
            clickSelectChart={wizardClickSelectChart}
            selectedIndicators={selectedIndicators}
            selectedChart={selectedChart}
            selectedCountries={selectedCountries}
            selectedRegions={selectedRegions}
            selectedYearRange={selectedYearRange}
            selectionsMessage={wizardSelectionsMessage}
            buildAllowed={wizardBuildAllowed}
            requestData={chartRequestData}
            selectedYearRange={selectedYearRange}
            originalYearRange={originalYearRange}
          />}
        {currentView === "chart" &&
          <ChartView
            dataLoading={chartDataLoading}
            dataLoaded={chartDataLoaded}
            data={chartData}
            selectedViewChart={selectedViewChart}
            liveChartTypeChange={chartLiveChartTypeChange}
            changeToWizardView={this.changeToWizardView.bind(this)}
            setCurrentViewYear={setCurrentViewYear}
            requestData={chartRequestData}
            selectedYearRange={selectedYearRange}
            originalYearRange={originalYearRange}
            saveViz={this.saveViz.bind(this)}
            closeSave={this.closeSave.bind(this)}
            initSave={this.initSave.bind(this)}
            autoSaveShare={this.autoSaveShare.bind(this)}
          />}
        {saveModal === true &&
          <SaveModal
              className="save-modal"
              saveViz={this.saveViz.bind(this)}
              closeSave={this.closeSave.bind(this)}
              initSave={this.initSave.bind(this)}
              saveModal={saveModal}
              {...this.props}
          /> }

      </div>
    );
  }
}

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
  const selectedYearRange = visualize.get("selectedYearRange");
  const originalYearRange = visualize.get("originalYearRange");
  const geoIsLoading = visualize.get("geoIsLoading");
  const geoLoaded = visualize.get("geoLoaded");
  const geoJson = visualize.get("geoJson");
  const averagesLoading = visualize.get("averagesLoading");
  const averagesLoaded = visualize.get("averagesLoaded");
  const averagesData = visualize.get("averagesData");
  const mapType = visualize.get("mapType");
  const savingViz = visualize.get("savingViz");
  const vizSaved = visualize.get("vizSaved");
  const savedVizID = visualize.get("savedVizID");

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
    selectedYearRange,
    originalYearRange,
    geoIsLoading,
    geoLoaded,
    geoJson,
    averagesLoading,
    averagesLoaded,
    averagesData,
    mapType,
    savingViz,
    vizSaved,
    savedVizID 
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(VisualizeActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Visualize);