import React, { Component } from "react";

import ChartBanner from "./chartview/chartBanner";
// import DataTable from "./chartview/DataTable";
// import Metadata from "./chartview/Metadata";
import BaseChart from "./chartview/baseChart";
// import MapChart from "./chartview/Map";

class ChartView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: "Chart",
      fromSavedID: undefined,
      saveModal: false
    };
  }

  changeTab(tab) {
    this.setState({
      currentTab: tab
    });
  }

  setupLoadViz(id) {
    this.setState({
      fromSavedID: id
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
    this.props.saveVisualization("SHARED URL - NO NAME").then(() => {
      this.setState({ saveModal: true });
    });
  }

  render() {
    const {
      dataLoaded,
      dataLoading,
      data,
      selectedViewChart,
      liveChartTypeChange
    } = this.props;

    const {
      currentTab,
      saveModal
    } = this.state;

    return (
      <div className="Chart__view">
        {dataLoading && <div className="FindFa__loading" />}
        {dataLoaded &&
          <ChartBanner
            currentTab={currentTab}
            chartType={selectedViewChart}
            liveChartTypeChange={liveChartTypeChange}
            changeTab={this.changeTab.bind(this)}
            data={data}
            closeSave={this.closeSave.bind(this)}
            initSave={this.initSave.bind(this)}
            autoSaveShare={this.autoSaveShare.bind(this)}
          />}
        {dataLoaded &&
          selectedViewChart != "Map" &&
          currentTab == "Chart" &&
          <BaseChart
            data={data}
            chartType={selectedViewChart}
            showSettings={true}
            showLegend={true}
            showAverage={true}
            showToolbar={true}
            showTitle={false}
            {...this.props}
          />}

        {/* Determine Which Components to show when data loaded *
          
          {dataLoaded &&
            buildChart == "Map" &&
            currentTab == "Chart" &&
            <MapChart
              data={data}
              showSettings={true}
              showAverage={false}
              chartType={buildChart}
              {...this.props}
            />}
          {dataLoaded &&
            buildChart != "Map" &&
            currentTab == "Chart" &&
            <BaseChart
              data={data}
              chartType={buildChart}
              showSettings={true}
              showLegend={true}
              showAverage={true}
              showToolbar={true}
              showTitle={false}
              {...this.props}
            />}
          {dataLoaded &&
            currentTab == "Data Table" &&
            <DataTable data={data} />}
          {dataLoaded && currentTab == "Meta Data" && <Metadata data={data} />}
        </div>

      */
        }

      </div>
    );
  }
}

export default ChartView;
