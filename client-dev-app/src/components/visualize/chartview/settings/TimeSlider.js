import React, { PropTypes, Component } from 'react';
import Nouislider from 'react-nouislider';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import _ from 'lodash';


class PlayPause extends Component {

  componentDidUpdate(){
    if (this.props.playing){
      const {listYears, pausePlayNext} = this.props;
      if(listYears.indexOf(pausePlayNext) == listYears.length - 1) {
        this.props.pausePlayingAction();
      }
      let self = this;
      setTimeout(function(){
        self.props.globalChangeYear(self.props.pausePlayNext);
      }, 1500);

    }
  }

  componentWillUnmount() {
    this.props.pausePlayingAction();
  }

  playYears() {
    this.props.startPlayingAction();
  }

  pauseYears() {
    this.props.pausePlayingAction();
  }

  render() {
    let colorClass = this.props.playing ? "viz-playing" : "";
    return (
      <div className="viz-play-years">
        <span className="play-button"  onClick={this.playYears.bind(this)}></span>
        <span className="pause-button" onClick={this.pauseYears.bind(this)}></span>
      </div>
    );
  }
}

export default class TimeSlider extends Component {
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
  }

  componentWillReceiveProps(props) {
    this.setState({
      listYears: props.listYears,
      startYear: props.startYear
    },()=> {
      this.styleSlider(this.state.listYears,this.state.startYear);
    });
  }

  onChangeYear() {
    let y = Math.floor(this.refs.yearSlider.slider.get());
    this.props.globalChangeYear(this.props.listYears[y]);
  }

  styleSlider(years,currYear) {
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

    $('.year-slider .noUi-value.noUi-value-horizontal.noUi-value-large').each(function(){
      var val = $(this).html();
      val = yearPips(parseInt(val,10), currYear, years);
      $(this).html(val);
    });

  }

  render() {
    const {
      startYear,
      numYears,
      listYears,
      lite
    } = this.props;

    // years come as strings and need to be parsed to matchup
    let startYearIndex = startYear != 'all' ? listYears.indexOf(parseInt(startYear,10)) : listYears.indexOf(startYear) ;

    const yearTooltip = (
      <Tooltip id="bubble-scale-tooltip"><strong>Select Year:</strong> Adjust for specific yearly data</Tooltip>
    );

    const header = !lite ? (
      <div>
        <OverlayTrigger placement="top" overlay={yearTooltip}>
            <h4 className="viz-setting-head">Year Slider:</h4>
        </OverlayTrigger>
        <div className="dummyClear"></div>
      </div>
      ) :null;

    let classNameSlider = lite ? 'lite-slider year-slider' : 'year-slider';

    return (
      <div className="viz-year-settings">
        {header}
        <div className={classNameSlider}>
          <Nouislider
            pips={{
              mode: 'count',
              values: numYears,
              density: numYears
            }}
            range={{
              min: 0,
              max: numYears - 1
            }}
            step={1}
            start={[startYearIndex]}
            onChange={this.onChangeYear.bind(this)}
            ref="yearSlider"
          />
          <br/>
          <PlayPause {...this.props} />
        </div>
      </div>
    );
  }
}
