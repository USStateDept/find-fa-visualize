import React, { PropTypes, Component } from "react";

class ChangeChart extends Component {
  constructor(props) {
    super(props);

    let list1 = ["Line", "Bar-Chart", "Stacked-Bar", "Map", "Treemap"];
    let list2 = ["Scatter", "Bubble"];

    let optionsList = list1.indexOf(props.chartType) !== -1
      ? list1
      : list2.indexOf(props.chartType) !== -2 ? list2 : [];

    this.state = {
      current: props.chartType,
      options: optionsList
    };
  }

  changeChart(e) {
    if (e.target.value !== "null") {
      this.props.changeChart(e.target.value);
    }
  }

  render() {
    return (
      <div className="Chart__banner-tool Chart__banner-chart-dropdown">
        <select onChange={this.changeChart.bind(this)}>
          <option value="null">Change Chart</option>
          {this.state.options.map((opt, i) => (
            <option value={opt} key={i}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }
}

ChangeChart.propTypes = {
  buildChart: PropTypes.string.isRequired,
  changeChart: PropTypes.func.isRequired
};

class ChartBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: props.data.countries,
      indicators: props.data.indicators
    };
  }

  render() {
    const {
      changeTab,
      currentTab,
      initSave,
      autoSaveShare,
      chartType,
      liveChartTypeChange,
      changeToWizardView
    } = this.props;

    let chActive = currentTab == "Chart" ? "Banner__tab-active" : "";
    let dtActive = currentTab == "Data Table" ? "Banner__tab-active" : "";
    let mdActive = currentTab == "Meta Data" ? "Banner__tab-active" : "";

    // create indicator title
    let indicatorTitle = "";

    if (this.props.data.indicators.length == 1) {
      indicatorTitle = (
        <div>
          <h1 className="Chart__banner-title">
            {this.props.data.indicators[0].name}
          </h1>
          <p className="Chart__banner-title-units">
            Units: {this.props.data.metadataSet[0].Units}
          </p>
        </div>
      );
    } else if (this.props.data.indicators.length == 2) {
      indicatorTitle = this.props.data.metadataSet.map((ind, i) => {
        return (
          <div>
            <h3 className="Chart__banner-title" key={i}>
              {ind.Indicator_Name}
            </h3>
            <p className="Chart__banner-title-units">Units: {ind.Units}</p>
          </div>
        );
      });
    } else {
      indicatorTitle = this.props.data.metadataSet.map((ind, i) => {
        return (
          <div>
            <h4 className="Chart__banner-title" key={i}>
              {ind.Indicator_Name}
            </h4>
            <p className="Chart__banner-title-units">Units: {ind.Units}</p>
          </div>
        );
      });
    }

    return (
      <div className="Chart__banner ">
        <div className="Chart__banner-actions">
          <ChangeChart
            chartType={chartType}
            changeChart={liveChartTypeChange}
          />
          <button onClick={autoSaveShare} type="button" className="banner-save" >Share</button>
          <button onClick={initSave} type="button" className="banner-save" >Save</button>
          <a
            onClick={changeToWizardView}
            className="Chart__banner-edit Chart__banner-tool"
          >
            Edit
          </a>
          <div className="dummyClear" />
        </div>
        {indicatorTitle}

        <div
          onClick={() => {
            changeTab("Chart");
          }}
          className={"Chart__banner-tabs " + chActive}
        >Chart</div>
        <div
          onClick={() => {
            changeTab("Data Table");
          }}
          className={"Chart__banner-tabs " + dtActive}
        >Data Table</div>
        <div
          onClick={() => {
            changeTab("Meta Data");
          }}
          className={"Chart__banner-tabs " + mdActive}
        >Source</div>

        <div className="dummyClear" />
      </div>
    );
  }
}

ChartBanner.propTypes = {
  data: PropTypes.object.isRequired,
  changeTab: PropTypes.func.isRequired,
  currentTab: PropTypes.string.isRequired
};

export default ChartBanner;
