import React, { PropTypes, Component } from "react";

const YearSelect = () => (
  <div>
    <h5>Select Year(s):</h5>
    <label for="all">All</label>
    <input name="all" type="checkbox" className="Chart__settings-checkbox" />
    <label for="range">Range</label>
    <input name="range" type="checkbox" className="Chart__settings-checkbox" />
    <div>
      <select><option>Start Year</option></select>
      <select><option>End Year</option></select>
    </div>
  </div>
);

class ChartSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listYears: props.listYears,
      startYear: props.startYear
    };
  }

  componentDidMount() {
    // year slider

    // request averages
    if (this.props.chartType !== "Map") {
      // this.props.requestAverageDataIfNeeded();
    }
  }

  componentWillReceiveProps(props) {
    // this.setState(
    //   {
    //     listYears: props.listYears,
    //     startYear: props.startYear
    //   },
    //   () => {
    //     this.styleSlider(this.state.listYears, this.state.startYear);
    //   }
    // );
  }

  onChangeScale() {
    let s = Math.floor(this.refs.scaleSlider.slider.get());
    this.props._onChangeScale(s);
  }

  onChangeYear() {
    let y = Math.floor(this.refs.yearSlider.slider.get());
    this.props._onChangeYear(this.props.listYears[y]);
  }

  render() {
    const {
      chartType,
      startScale,
      actualScale,
      startYear,
      numYears,
      listYears,
      showAverage,
      data
    } = this.props;

    // const rotateTooltip = (
    //   <Tooltip id="bubble-scale-tooltip">
    //     <strong>Rotate Axes:</strong>
    //     {" "}Switches which axis demensions (x,y,scale) indicators apply to.
    //   </Tooltip>
    // );

    return (
      <div className="viz-chart-settings">

        <YearSelect
          globalChangeYear={this.props._onChangeYear}
          listYears={listYears}
          startYear={startYear}
          numYears={numYears}
          {...this.props}
        />

        {/*chartType === "Bubble" || chartType === "Bubble-3"
          ? <div className="viz-bubble-settings">
              <OverlayTrigger placement="top" overlay={scaleTooltip}>
                <h4 className="viz-setting-head">Bubble Scale:</h4>
              </OverlayTrigger>
              <div className="dummyClear" />
              <div className="scale-slider">
                <Nouislider
                  pips={{
                    mode: "range",
                    density: 9
                  }}
                  range={{
                    min: 0,
                    max: 16
                  }}
                  step={1}
                  start={[actualScale]}
                  onChange={this.onChangeScale.bind(this)}
                  ref="scaleSlider"
                />
              </div>
            </div>
          : null*/
        }

        {chartType === "Bubble" ||
          chartType === "Bubble-3" ||
          chartType === "Scatter"
          ? <div className="viz-setting-rotate">
              <h5 className="viz-setting-head">Rotate Axes:</h5>
              <div className="dummyClear" />
              <button onClick={this.props.switchAxis} />
            </div>
          : null}

      </div>
    );
  }
}

ChartSettings.propTypes = {
  _onChangeYear: PropTypes.func.isRequired,
  _onChangeScale: PropTypes.func.isRequired,
  startScale: PropTypes.number.isRequired,
  startYear: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  numYears: PropTypes.number.isRequired,
  chartType: PropTypes.string.isRequired,
  switchAxis: PropTypes.func.isRequired
};

export default ChartSettings;
