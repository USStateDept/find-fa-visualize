import React, { PropTypes, Component } from 'react';
import Nouislider from 'react-nouislider';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import _ from 'lodash';
import TimeSlider from './settings/TimeSlider';

/**
 * Play/Pause Component
 *
 */

class AverageButton extends Component {

  render() {

    return (
      <li className="viz-avg-option"><span  onClick={this.props.toggleAverage}>{this.props.averageType}</span></li>
    );
  }
}

/**
 * Stats on Data
 */
class DataStats extends Component {

  toggleAverage(type) {
    this.props.setAverergeData(type);
  }

  render() {
    const {
      removedLocations,
      nullAvailibility,
      startYear
    } = this.props;

    // datapoints per year
    let dataPoints =  nullAvailibility[startYear].datapoints;
    let missingData = nullAvailibility[startYear].missingpoints;

    // removed countries
    let locationsRemoved = startYear == 'all'
      ? removedLocations.map(c => {return " " + c})
      : nullAvailibility[startYear].locations_no_data;

    const dataTooltip = (
      <Tooltip id="bubble-scale-tooltip"><strong>Data:</strong> General Stats on data being visualized</Tooltip>
    );

    return (
      <div className="viz-data-settings">
        <div>
          <OverlayTrigger placement="top" overlay={dataTooltip}>
              <h4 className="viz-setting-head">Data:</h4>
          </OverlayTrigger>
          <div className="dummyClear"></div>
          <ul className="viz-data-stats">
            <li>Shown data points:<span className="text-navy">{' ' + dataPoints}</span></li>
            <li>Missing data points:<span className="text-red">{' ' + missingData}</span></li>
            <li>Countries/Regions in this selection with no data: <p className="text-red">{locationsRemoved.toString() || "none"}</p></li>
          </ul>
        </div>
        </div>
      );

  }

}

/**
 * Average Buttons Component
 *
 */
class AverageSettings extends Component {

  toggleAverage(type) {
    this.props.setAverergeData(type);
  }

  render() {

    const {averagesLoading, averagesLoaded, selectedIndicators} = this.props;

    let
      showPop = true,
      showEql = true,
      showGdp = true;

    _.each(selectedIndicators, ind => {
      showPop = showPop ? ind.avgPop : showPop;
      showGdp = showGdp ? ind.avgGdp : showGdp;
      showEql = showEql ? ind.avgEql : showEql;
    });

    let averageTypes = [
      {type: 'equal', show: showEql, text:'Arithmetic Mean - No Weight'},
      {type: 'population', show: showPop, text: 'Arithmetic Mean - Population Weight'},
      {type: 'gdp', show: showGdp, text: 'Arithmetic Mean - GDP Weight'}
    ];

    const averageTooltip = (
      <Tooltip id="bubble-scale-tooltip"><strong>Averages:</strong> Display generic arithmetic mean or, if applicable, weighted averages</Tooltip>
    );

    if(averagesLoading) {
      return (
        <div> Loading ... </div>
      );
    } else {
      return (
        <div className="viz-avg-settings">
        <div>
          <OverlayTrigger placement="top" overlay={averageTooltip}>
              <h4 className="viz-setting-head">Averages:</h4>
          </OverlayTrigger>
          <div className="dummyClear"></div>
         <ul>
          {averageTypes.map( avg => {
            return avg.show ? <AverageButton  toggleAverage={this.toggleAverage.bind(this,avg.type)} averageType={avg.text}/> : null
          })}
        </ul>
        </div>
        </div>
      );
    }

  }

}



/**
 * Parent Settings Component
 *
 */
export default class Settings extends Component {
  constructor(props){
    super(props);
    this.state = {
      listYears: props.listYears,
      startYear: props.startYear
    };
  }

  componentDidMount(){
    // year slider
    this.styleSlider(this.state.listYears,this.state.startYear);
    // request averages
    if(this.props.chartType != 'Map') {
      this.props.requestAverageDataIfNeeded();
    }

  }

  componentWillReceiveProps(props) {
    this.setState({
      listYears: props.listYears,
      startYear: props.startYear
    },()=> {
      this.styleSlider(this.state.listYears,this.state.startYear);
    });
  }

  onChangeScale() {
    let s = Math.floor(this.refs.scaleSlider.slider.get());
    this.props._onChangeScale(s);
  }

  onChangeYear() {
    let y = Math.floor(this.refs.yearSlider.slider.get());
    this.props._onChangeYear(this.props.listYears[y]);
  }

  styleSlider() {
    var $ = require ('jquery');

    function yearPips(_val, _currYear, _years){
      for (let i = _years.length - 1; i >= 0; i--) {
        if (_val == i && i == _years.length - 1) {
          if(_currYear == 'all') {
            return `<p class="settings-year"><b>all</b></p>`;
          }
          return 'all';
        }
        if ( i == _val ) {
          if (parseInt(_years[i],10) == _currYear) {
            return `<p class="settings-year"><b>${parseInt(_years[i],10)}</b></p>`;
          }
          return parseInt(_years[i],10);
        }
      };

      return null;
    }


    function scalePips(val){
      for (var i = 16; i >= 0; i--) {
        if (i == 16 && val == 16) {
          return 'Large';
        }
        if ( i == 0 && val == 0  ) {
          return 'Small';
        }
      };
    }

    let scale = this.state.scale;
    $('.scale-slider .noUi-value.noUi-value-horizontal.noUi-value-large').each(function(){
      var val = $(this).html();
      val = scalePips(parseInt(val,10));
      $(this).html(val);
    });


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

    const scaleTooltip = (
      <Tooltip id="bubble-scale-tooltip"><strong>Bubble Scale:</strong> Adjust to try and match data</Tooltip>
    );

    const rotateTooltip = (
      <Tooltip id="bubble-scale-tooltip"><strong>Rotate Axes:</strong> Switches which axis demensions (x,y,scale) indicators apply to.</Tooltip>
    );


    return (
      <div className="viz-chart-settings">
        <TimeSlider
          globalChangeYear={this.props._onChangeYear}
          listYears={listYears}
          startYear={startYear}
          numYears={numYears}
          {...this.props}
        />

      {chartType == 'Bubble' || chartType == 'Bubble-3' ?

        <div className="viz-bubble-settings">
        <OverlayTrigger placement="top" overlay={scaleTooltip}>
          <h4 className="viz-setting-head">Bubble Scale:</h4>
        </OverlayTrigger>
        <div className="dummyClear"></div>
        <div className="scale-slider">
        <Nouislider
          pips={{
            mode: 'range',
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
      :null}

      {chartType == 'Bubble' || chartType == 'Bubble-3' ||  chartType == 'Scatter' ?
        <div className="viz-setting-rotate">
          <OverlayTrigger placement="top" overlay={rotateTooltip}>
            <h5 className="viz-setting-head">Rotate Axes:</h5>
          </OverlayTrigger>
          <div className="dummyClear"></div>
          <button onClick={this.props.switchAxis}></button>
       </div>
      : null}

      {showAverage &&
          <AverageSettings {...this.props} />
      }

      <DataStats
        startYear={startYear}
        nullAvailibility={data.nullAvailibility}
        removedLocations={data.removedLocations}
      />


      </div>

    );
  }

}

Settings.propTypes = {
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