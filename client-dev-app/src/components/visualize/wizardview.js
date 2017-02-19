import React, { Component, PropTypes } from "react";

import IndicatorSelect from "./wizardview/indicatorSelect";
import CountrySelect from "./wizardview/countrySelect";
import ChartSelect from "./wizardview/chartSelect";
import SummaryBox from "./wizardview/summaryBox";

class WizardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wizardCurrentKey: 0 // [0:indicators, 1:countries, 2:chart]
    };
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

    return false;
  }

  changeWizardState(index) {
    this.setState({
      wizardState: index
    });
  }

  buildVisualizationAction() {
    this.props.requestDataForBuild();
  }

  render() {
    const {
      selectedIndicators,
      // selectedCountries,
      // selectedRegions,
      // selectedChart,

      // // actions
      // clickSelectIndicator,
      // clickSelectCountry,
      // clickSelectRegion,
      // clickSelectChart

      indicatorSetup,
      countriesSetup,

      //actions
      clickSelectIndicator
    } = this.props;

    console.log(selectedIndicators);
    return (
      <div className="Wizard__view">
        <div className="Wizard__menu-column">
          {this.state.wizardCurrentKey === 0 &&
            <IndicatorSelect
              setup={indicatorSetup}
              selectIndicator={clickSelectIndicator}
            />}
          {this.state.wizardCurrentKey === 1 &&
            <CountrySelect setup={countriesSetup} />}
          {this.state.wizardCurrentKey === 2 && <ChartSelect />}
        </div>
        <div className="Wizard__menu-column">
          <SummaryBox
            selectedIndicators={selectedIndicators}
            deselectIndicator={clickSelectIndicator}
          />
        </div>
      </div>
    );
  }
}

WizardView.PropTypes = {
  indicatorSetup: PropTypes.object.isRequired,
  countriesSetup: PropTypes.object.isRequired
};

export default WizardView;
