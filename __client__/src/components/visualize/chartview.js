import React, { Component } from "react";

// import ChartBanner from "./chartview/Banner";
// import DataTable from "./chartview/DataTable";
// import Metadata from "./chartview/Metadata";
// import BaseChart from "./chartview/BaseChart";
// import MapChart from "./chartview/Map";

class ChartView extends Component {
  render() {
    const {
      dataLoaded,
      dataLoading,
      displayModal,
      buildChart,
      data
    } = this.props;

    return (
      <div>
        <div id="content" className="viz-content find-body">

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
      </div>
    );
  }
}

export default ChartView;
