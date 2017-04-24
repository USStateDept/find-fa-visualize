import { MapControl } from 'react-leaflet';
import Nouislider from 'react-nouislider';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import TimeSlider from './TimeSlider';

export default class TimeSliderControl extends MapControl {
  componentWillMount() {
    const slider = L.control({position: 'bottomleft'});
    const jsx = (
        <TimeSlider
            {...this.props}
            globalChangeYear={this.props.globalChangeYear.bind(this)}
            startYear={this.props.startYear}
            numYears={this.props.data.listYears.length}
            chartType={this.props.chartType}
            listYears={this.props.data.listYears}
            pausePlayNext={this.props.pausePlayNext}
            lite={true}
        />
    );

    slider.onAdd = function (map) {
      let div = L.DomUtil.create('div', 'info legend');
      ReactDOM.render(jsx, div);
      return div;
    };

    this.leafletElement = slider;
  }
}
