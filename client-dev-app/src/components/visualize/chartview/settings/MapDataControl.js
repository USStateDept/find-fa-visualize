import React, { PropTypes, Component } from 'react';
import { MapControl } from 'react-leaflet';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ReactDOM from 'react-dom';

var L = process.browser ? require('leaflet') : undefined;

export default class MapDataControl extends MapControl {
  componentWillMount() {
    let info = L.control({position: 'topright'});

    let jsx =(
        <span>
          <h4>Country</h4><br/>
          <p>Hover over a country</p>
        </span>
      );

    info.onAdd = (map) => {
      let div = L.DomUtil.create('div', 'info map-info'); // create a div with a class "info"
      ReactDOM.render(jsx, div);
      return div;
    };

    this.leafletElement = info;
  }
}
