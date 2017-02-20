import React, { Component } from "react";

// import ChartBanner from "./chartview/Banner";
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

  render() {
    const {
      dataLoaded,
      dataLoading,
      data,
      selectedViewChart
    } = this.props;

    const {
      currentTab,
      saveModal
    } = this.state;

    return (
      <div className="Chart__view">
        {dataLoading && <div className="FindFa__loading" />}
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
        }


        {/* Determine Which Components to show when data loaded *
          {dataLoaded &&
            <ChartBanner
              {...this.props}
              currentTab={currentTab}
              changeTab={this.changeTab.bind(this)}
              data={data}
              saveViz={this.saveViz.bind(this)}
              closeSave={this.closeSave.bind(this)}
              initSave={this.initSave.bind(this)}
              autoSaveShare={this.autoSaveShare.bind(this)}
            />}
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
