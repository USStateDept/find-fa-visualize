import React, { Component } from "react";

import IndicatorSelect from "./wizardview/indicatorSelect";
import CountrySelect from "./wizardview/countrySelect";
import ChartSelect from "./wizardview/chartSelect";

class WizardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wizardCurrentKey: 0 // [0:indicators, 1:countries, 2:chart]
    };
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
      selectedCountries,
      selectedRegions,
      selectedChart,

      // actions
      clickSelectIndicator,
      clickSelectCountry,
      clickSelectRegion,
      clickSelectChart
    } = this.props;

    return (
      <div>
        <div id="content" className="viz-content find-body">
          {this.state.wizardCurrentKey === 0 && <IndicatorSelect />}
          {this.state.wizardCurrentKey === 1 && <CountrySelect />}
          {this.state.wizardCurrentKey === 2 && <ChartSelect />}

        </div>
      </div>
    );
  }
}

export default WizardView;
