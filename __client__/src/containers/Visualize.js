import React, { Component } from "react";

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

export default Visualize;
