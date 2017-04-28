import React, { PropTypes, Component } from 'react';
import { MapControl } from 'react-leaflet';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ReactDOM from 'react-dom';

var L = process.browser ? require('leaflet') : undefined;

export default class MapLegendControl extends MapControl {
  componentWillMount() {
    const legend = L.control({position: 'bottomright'});

    const {
      maxValue
    } = this.props;

    let grades = [
      0, maxValue * .15,
      maxValue * .25, maxValue * .5, maxValue * .75,
      maxValue * .9, maxValue
    ];

    let colors = [
      '#003466','#174673',
      '#2E5881','#456B8F',
      '#5C7D9D','#7390AB',
      '#8BA2B9'
    ];

    grades = grades.map(c => { return Math.ceil(c); });

    // loop through our density intervals and generate a label with a colored square for each interval
    let jsx =(
        <div>
        {grades.map((grade,i) =>
          <span>
            <i style={{background: colors[colors.length - i - 1]}}></i>
            {grade + ( grades[i + 1] ? ' - ' + grades[i + 1]:null)} <br/>
          </span>
        )}
        </div>
      );

    legend.onAdd = (map) => {
      let div = L.DomUtil.create('div', 'info legend');
      ReactDOM.render(jsx, div);
      return div;
    };

    this.leafletElement = legend;
  }
}
