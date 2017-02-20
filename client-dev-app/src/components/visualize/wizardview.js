import React, { Component, PropTypes } from "react";

import BeginWizard from "./wizardview/beginWizard";
import IndicatorSelect from "./wizardview/indicatorSelect";
import CountrySelect from "./wizardview/countrySelect";
import ChartSelect from "./wizardview/chartSelect";
import SummaryBox from "./wizardview/summaryBox";
import ProgressButtons from "./wizardview/progressButtons";

import ReactToastr, { ToastContainer, ToastMessage } from "react-toastr";

var ToastMessageFactory = React.createFactory(ToastMessage.animation);

class WizardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWizard: "begin",
      nextWizard: "",
      startWizard: "",
      prevWizard: ""
    };
  }

  componentDidUpdate() {
    if (this.props.selectionsMessage) {
      this.refs.container.warning(this.props.selectionsMessage, "Oops!", {
        closeButton: true
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.indicatorSetup.equals(this.props.indicatorSetup)) {
      return true;
    }
    if (!nextProps.countriesSetup.equals(this.props.countriesSetup)) {
      return true;
    }
    if (!nextProps.selectedIndicators.equals(this.props.selectedIndicators)) {
      return true;
    }
    if (!nextState.currentWizard !== this.state.currentWizard) {
      return true;
    }
    return false;
  }

  changeWizardState(direction) {
    if (
      this.state.currentWizard === this.state.startWizard &&
      direction === "next"
    ) {
      this.setState(
        Object.assign({}, this.state, {
          prevWizard: this.state.currentWizard,
          currentWizard: this.state.nextWizard,
          nextWizard: "chart"
        })
      );
    } else if (
      this.state.currentWizard !== this.state.startWizard &&
      direction === "next"
    ) {
      this.setState(
        Object.assign({}, this.state, {
          prevWizard: this.state.currentWizard,
          currentWizard: "chart",
          nextWizard: false
        })
      );
    } else if (this.state.currentWizard === "chart" && direction === "back") {
      this.setState(
        Object.assign({}, this.state, {
          prevWizard: this.state.startWizard,
          currentWizard: this.state.prevWizard,
          nextWizard: this.state.currentWizard
        })
      );
    } else if (this.state.currentWizard !== "chart" && direction === "back") {
      this.setState(
        Object.assign({}, this.state, {
          prevWizard: false,
          currentWizard: this.state.prevWizard,
          nextWizard: this.state.currentWizard
        })
      );
    } else {
      //
    }
  }

  initWizard(option) {
    if (option === "indicator") {
      this.setState({
        startWizard: "indicator",
        currentWizard: "indicator",
        prevWizard: false,
        nextWizard: "country"
      });
    } else {
      this.setState({
        startWizard: "country",
        currentWizard: "country",
        nextWizard: "indicator",
        prevWizard: false
      });
    }
  }

  buildVisualizationAction() {
    this.props.requestDataForBuild();
  }

  render() {
    const {
      selectedIndicators,

      // // actions
      // clickSelectIndicator,
      // clickSelectCountry,
      // clickSelectRegion,
      // clickSelectChart

      indicatorSetup,
      countriesSetup,

      selectedCountries,
      selectedRegions,
      selectionsMessage,
      selectedChart,

      //actions
      clickSelectIndicator,
      clickSelectCountry,
      clickSelectChart,
      clickSelectAllCountries
    } = this.props;

    const {
      currentWizard,
      nextWizard,
      prevWizard
    } = this.state;

    return (
      <div className="Wizard__view">
        {selectionsMessage &&
          <ToastContainer
            ref="container"
            toastMessageFactory={ToastMessageFactory}
            className="toast-top-right"
          />}
        {currentWizard === "begin"
          ? <BeginWizard
              selectIndicator={clickSelectIndicator}
              initWizard={this.initWizard.bind(this)}
            />
          : <div>
              <div className="Wizard__menu-column">

                {currentWizard === "indicator" &&
                  <IndicatorSelect
                    setup={indicatorSetup}
                    selectIndicator={clickSelectIndicator}
                    selectedIndicators={selectedIndicators}
                  />}
                {currentWizard === "country" &&
                  <CountrySelect
                    setup={countriesSetup}
                    selectCountry={clickSelectCountry}
                    setMapTypeForGeojson={() =>
                      console.log("< LOAD GEOJSON HERE>")}
                    selectedRegions={selectedRegions}
                    selectedCountries={selectedCountries}
                    selectAllCountries={clickSelectAllCountries}
                  />}
                {currentWizard === "chart" &&
                  <ChartSelect
                    selectChart={clickSelectChart}
                    selectedChart={selectedChart}
                    chartOptiontype={
                      selectedIndicators.size === 0 ||
                        selectedIndicators.size > 3
                        ? "none"
                        : selectedIndicators.size === 1
                            ? "one"
                            : selectedIndicators.size === 2 ? "two" : "three"
                    }
                  />}
              </div>
              <div className="Wizard__menu-column">
                <SummaryBox
                  selectedIndicators={selectedIndicators}
                  deselectIndicator={clickSelectIndicator}
                  selectedCountries={selectedCountries}
                  deselectCountry={clickSelectCountry}
                  deselectChart={clickSelectChart}
                  selectionsMessage={selectionsMessage}
                  selectedChart={selectedChart}
                />
                <ProgressButtons
                  changeWizardState={this.changeWizardState.bind(this)}
                  showFinish={nextWizard}
                  showBack={prevWizard}
                />
              </div>
            </div>}
      </div>
    );
  }
}

WizardView.PropTypes = {
  indicatorSetup: PropTypes.object.isRequired,
  countriesSetup: PropTypes.object.isRequired
};

export default WizardView;
