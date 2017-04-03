import React, { PropTypes, Component } from "react";
import _ from "lodash";
import TreemapGenerate from "./treemapGenerate";
import ChartSettings from "./chartSettings";

import Plotly from "plotly.js/lib/core";
Plotly.register([
  require("plotly.js/lib/bar"),
  require("plotly.js/lib/scatter")
]);

/**
 * BaseChart Component, builds out the chart and uses plotly.
 * Based ona switch statement and the current selected chart
 *
 */
class BaseChart extends Component {
  constructor(props) {
    super(props);

    const {
      chartType,
      data: {
        shouldChartRender,
        nullAvailibility,
        chartData,
        metadataSet,
        countries,
        indicators,
        simpleSet,
        listYears,
        removedLocations
      }
    } = props;

    let startYear;
    if (shouldChartRender && !props.chartSelectedYearRange) {
      startYear = "all";
    }

    this.state = {
      // Each chart will start showing all data
      shouldChartRender: shouldChartRender,
      data: chartData,
      metadata: metadataSet,
      countries: countries,
      indicators: indicators,
      chartType: chartType,
      simpleData: simpleSet,
      listYears: listYears,
      removedLocations: removedLocations,
      year: startYear, // start showing at last year
      chartID: `plotly-chart-${props.uid}`
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        chartType: nextProps.chartType || this.props.chartType,
        data: nextProps.data.chartData || this.props.chartData,
        countries: nextProps.data.countries || this.props.countries,
        indicators: nextProps.data.indicators || this.props.indicators,
        simpleData: nextProps.data.simpleSet || this.props.simpleData,
        listYears: nextProps.data.listYears || this.props.listYears,
        removedLocations: nextProps.data.removedLocations || this.props.removedLocations
      },
      () => {
        this.renderNewChart();
      }
    );
  }

  componentDidMount() {
    this.renderNewChart();
  }

  renderNewChart() {
    // a null/warning message will be rendered elsewise
    if (this.state.shouldChartRender) {
      this.plotlyRenderStyle();
    }
  }

  plotlyRenderStyle() {
    // draw the chart with the corresponding startdate
    let dataSet = this.state.data[this.state.year].traces.slice(0);

    // sometimes there will be empty indexes in this array
    dataSet = _.without(dataSet, undefined);
    let chartType = this.state.chartType.slice(0);

    let layout = {
      yaxis: {
        title: this.state.indicators[0].name,
        titlefont: { size: 20 }
      },
      xaxis: {
        title: "Year",
        tickformat: "%Y",
        hoverformat: "%Y",
        titlefont: { size: 20 }
      },
      showlegend: this.state.showLegend,
      margin: {
        t: 20
      },
      font: {
        family: "'Open Sans',Arial,Helvetica,sans-serif",
        color: "#00576c"
      },
      paper_bgcolor: "#ffeed2",
      plot_bgcolor: "#ffeed2"
    };

    if (this.state.showTitle) {
      layout.title = this.state.metadata[0].Indicator_Name;
    }

    switch (chartType) {
      case "Bar-Chart": {
        _.forEach(dataSet, trace => {
          trace.type = "bar";
        });
        layout.barmode = "group";
        layout.bargap = 0.15;
        layout.bargroupgap = 0.1;
        break;
      }
      case "Stacked-Bar": {
        _.forEach(dataSet, trace => {
          trace.type = "bar";
        });
        layout.barmode = "stack";
        layout.bargap = 0.15;
        layout.bargroupgap = 0.1;
        break;
      }
      case "Bubble": {
        _.forEach(dataSet, trace => {
          trace.x = trace.xBubble;
          trace.mode = "markers";
          trace.marker.sizemode = "area";
          trace.marker.sizemin = 5;
          trace.marker.size = trace.marker.protoSize;
        });
        break;
      }
      case "Bubble-3": {
        _.forEach(dataSet, trace => {
          trace.mode = "markers";
          trace.marker.sizemode = "area";
          trace.marker.sizemin = 10;
          trace.marker.size = trace.marker.protoSize;
        });
        layout.xaxis = Object.assign({}, layout.xaxis, {
          title: this.state.indicators[1].name
        });
        break;
      }
      case "Line": {
        _.forEach(dataSet, trace => {
          trace.type = "scatter";
          trace.mode = trace.average ? "lines" : "lines+markers";
        });
        break;
      }
      case "Scatter": {
        _.forEach(dataSet, trace => {
          trace.x = trace.xScatter;
          trace.type = "scatter";
          trace.mode = "markers";
          trace.marker.size = 12;
        });
        layout.xaxis = Object.assign({}, layout.xaxis, {
          title: this.state.indicators[1].name
        });
        break;
      }
      case "Treemap": {
        let annotations = [];
        let traces = [];
        let values = this.state.simpleData;
        let rectangles = TreemapGenerate.generate(values, 150, 150);

        for (let i = 0; i < rectangles.length; i++) {
          let x0 = rectangles[i][0],
            y0 = rectangles[i][1],
            x1 = rectangles[i][2],
            y1 = rectangles[i][3],
            country = this.state.countries[i];

          let trace = {
            name: country.Name,
            visible: true,
            mode: "lines",
            y: [y0, y1, y1, y0, y0],
            x: [x0, x0, x1, x1, x0],
            type: "scatter",
            fill: "tozeroy"
          };
          traces.push(trace);
          let annotation = {
            x: (rectangles[i][0] + rectangles[i][2]) / 2,
            y: (rectangles[i][1] + rectangles[i][3]) / 2,
            text: country.ISO + "\n" + Math.floor(values[i]),
            showarrow: false
          };
          annotations.push(annotation);
        }
        dataSet = traces;
        layout.annotations = annotations;
        break;
      }
      default:
      // none
    }

    // Plotly Final options
    let plotlySettings = {
      displayModeBar: true,
      // modeBarButtonsToAdd: [
      //   {
      //     name: "show all",
      //     click: gd => {
      //       Plotly.restyle(gd, "visible", true);
      //     },
      //     icon: Plotly.Icons["eye"]
      //   },
      //   {
      //     name: "hide all",
      //     click: gd => {
      //       Plotly.restyle(gd, "visible", "legendonly");
      //     },
      //     icon: Plotly.Icons["eye-off"]
      //   }
      // ],
      modeBarButtonsToRemove: [
        "zoom2d",
        "lasso2d",
        "resetScale2d",
        "autoScale2d",
        "resetGeo",
        "hoverCompareCartesian",
        "hoverClosestCartesian"
      ]
    };

    Plotly.newPlot(this.state.chartID, dataSet, layout, plotlySettings);
    if (!this.state.showAverage) {
      Plotly.deleteTraces(this.state.chartID, 0);
    }
  }

  selectYear(e) {
    if (e.target.value !== "null") {
      this.setState(
        Object.assign({}, this.state, { year: e.target.value }),
        () => {
          this.renderNewChart();
          this.props.setCurrentViewYear(this.state.year);
        }
      );
    }
  }

  render() {
    let view = this.state.shouldChartRender
      ? <div className="Chart__container">
          <div
            id={this.state.chartID}
            key={this.state.chartType + Math.random()}
            ref="chartContainer"
          />
          <ChartSettings
            startYear={this.state.year}
            listYears={this.state.listYears}
            selectYear={this.selectYear.bind(this)}
          />

          <div className="Chart__removedLocations">
            <p><b>Countries/Regions in this selection with no data:</b></p>
              {this.state.removedLocations.map(function(location, i){
                return <span key={i}>{location}, </span>})
              }
          </div>

        </div>
      : <div>
          <br /><br /><br /><br /><br />
          <h4>
            Sorry. One or more of your indicators in this selection doesn't contain any data, so we can't create a chart.
          </h4>
          <h4>Please try a different selection.</h4>
          <div className="no-viz-sizing" />
        </div>;

    return view;
  }
}

BaseChart.propTypes = {
  data: PropTypes.object.isRequired,
  chartType: PropTypes.string.isRequired
};

export default BaseChart;
