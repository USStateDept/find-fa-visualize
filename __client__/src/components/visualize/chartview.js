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

// function mapStateToProps(state) {
//   // deconstruct from state
//   let { visualize } = state;
//   visualize = visualize.present;
//   // deconstruct from visualize
//   const {
//     setupLoaded,
//     dataLoaded,
//     dataLoading,
//     currentYearView,
//     categories,
//     countries,
//     selectedIndicators,
//     selectedCountries,
//     selectedRegions,
//     selectedChart,
//     buildChart,
//     data,
//     dataResults,
//     buildReady,
//     buildMessage,
//     geoIsLoading,
//     geoLoaded,
//     geoJson,
//     averagesLoading,
//     averagesLoaded,
//     averagesData,
//     mapType
//   } = visualize ||
//     {
//       setupLoaded: false, // got setup from server
//       dataLoaded: false, // got data from server
//       dataLoading: false, // requested and waiting for data
//       currentYearView: false,
//       categories: List([]), // the loading of the menu
//       countries: List([]),
//       selectedIndicators: List([]), // user setup choices
//       selectedCountries: List([]),
//       selectedRegions: List([]),
//       selectedChart: "",
//       buildChart: "", // the chart being used for build & on the fly changes
//       data: Map({}), // data used to draw current viz
//       dataResults: Map({}), // data that came directly from server
//       buildReady: false,
//       buildMessage: "",
//       geoIsLoading: false,
//       geoLoaded: false,
//       geoJson: undefined,
//       averagesLoading: false,
//       averagesLoaded: false,
//       averagesData: Map({
//         population: null,
//         gdp: null,
//         equal: null
//       }),
//       mapType: null
//     };
//   return {
//     setupLoaded,
//     dataLoaded,
//     dataLoading,
//     currentYearView,
//     categories,
//     countries,
//     selectedIndicators,
//     selectedCountries,
//     selectedRegions,
//     selectedChart,
//     buildChart,
//     data,
//     dataResults,
//     buildReady,
//     buildMessage,
//     geoIsLoading,
//     geoLoaded,
//     geoJson,
//     averagesLoading,
//     averagesLoaded,
//     averagesData,
//     mapType
//   };
// }
// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(VisualizeActions, dispatch);
// }
// export default connect(mapStateToProps, mapDispatchToProps)(Visualize);

export default ChartView;
