import React, { PropTypes, Component } from "react";

class ChangeChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: props.buildChart,
      options: []
    };
  }

  componentWillMount() {
    let list1 = ["Line", "Bar-Chart", "Stacked-Bar", "Map", "Treemap"];
    let list2 = ["Scatter", "Bubble"];
    //Make list 3 if needed
    var oneDex = list1.indexOf(this.state.current);
    var twoDex = list2.indexOf(this.state.current);
    if (oneDex != -1) {
      this.setState({
        options: ["Line", "Bar-Chart", "Stacked-Bar", "Map", "Treemap"]
      });
    }
    if (twoDex != -1) {
      this.setState({ options: ["Scatter", "Bubble"] });
    }
  }

  changeChart(e) {
    if (e.target.value != "null") {
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
      autoSaveShare
    } = this.props;

    let chActive = currentTab == "Chart" ? "Banner__tab-active" : "";
    let dtActive = currentTab == "Data Table" ? "Banner__tab-active" : "";
    let mdActive = currentTab == "Meta Data" ? "Banner__tab-active" : "";

    // create indicator title
    let indicatorTitle = "";
    console.log(this.props.data.indicators);
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
            buildChart={this.props.buildChart}
            changeChart={this.props.liveChartChange}
          />
          <a
            onClick={this.props.displayModal}
            className="Chart__banner-edit Chart__banner-tool"
          >
            Edit
          </a>
          <div className="dummyClear" />
        </div>
        {indicatorTitle}
        <ul>
          <li
            onClick={() => {
              changeTab("Chart");
            }}
            className={"Chart__banner-tabs " + chActive}
          >Chart</li>
          <li
            onClick={() => {
              changeTab("Data Table");
            }}
            className={"Chart__banner-tabs " + dtActive}
          >Data Table</li>
          <li
            onClick={() => {
              changeTab("Meta Data");
            }}
            className={"Chart__banner-tabs " + mdActive}
          >Meta Data</li>
        </ul>
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
