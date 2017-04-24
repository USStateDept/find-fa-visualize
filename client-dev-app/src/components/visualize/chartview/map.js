import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Settings from './settings';
import regionLookup from './lib/RegionLookup.js';
import { MapControl } from 'react-leaflet';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

var L = require('leaflet');

class MapDataControl extends MapControl {
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

class MapLegendControl extends MapControl {
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

export default class MapChart extends Component {
  constructor(props){
    super(props);

    let startYear = props.chartType == 'Line' || props.chartType == 'Bubble' || props.chartType == 'Bubble-3' || props.chartType == 'Stacked-Bar'
          ? 'all'
          : props.data.listYears[props.data.listYears.length - 2];

    this.state = {
      maxValue: props.data.maxValue,
      shouldChartRender: props.data.shouldChartRender,
      data: props.data.chartData,
      metadata: props.data.metadataSet,
      countries: props.data.countries,
      indicators: props.data.indicators,
      chartType: props.chartType,
      year: startYear, // start showing at last year
      pausePlayNext: props.data.listYears[0],
      listYears: props.data.listYears,
      showLegend: props.showLegend,
      showToolbar: props.showToolbar,
      showTitle: props.showTitle,
      showAverage: props.showAverage,
      previewMode: props.previewMode,
    };
  }

  componentDidMount() {
    //defaulting to world until there's time to include
    //setMapTypeForGeojson functionality
    //this.props.fetchGeoJson(this.props.mapType);
    this.props.fetchGeoJson("world");
  }

  // passed to child (settings)
  globalChangeYear(year){
    let nextIndex = this.state.listYears.indexOf(year) + 1;
    this.setState({year: year, pausePlayNext: this.state.listYears[nextIndex] }, a => {
      this.renderNewChart();
    });
  }

  renderNewChart() {
    const {
      geoJson,
      geoIsLoading,
      geoLoaded,
      selectedRegions
    } = this.props;
    let _regionType = 'country';
    // draw the chart with the corresponding startdate
    // leaflet can only run in browser so important to make sure this only runs there
    // see src/client/index for declaration
    if( process.browser) {

      let { GeoJson, Map, Marker, Popup, TileLayer} = require('react-leaflet');
      //let MapLegendControl = require('./settings/MapLegendControl');
      //let MapDataControl = require('./settings/MapDataControl');

       // make sure geoJson is loaded
      if(geoIsLoading || !geoLoaded) {
        return (
          <div>
          <div className="no-viz-sizing-map"></div>
          <div className="loading"></div>
          <div className="no-viz-msg">
              <h3>Loading Map</h3>
          </div>
          </div>
        );

      } else { // it's loaded, return leaflet map
        let mapSet = this.state.data[this.state.year].traces.slice(0);

        mapSet = _.without(mapSet, null, undefined);
        const { maxValue } = this.props.data;

        function highlightFeature(e) {
          var layer = e.target;

          layer.setStyle({
            fillColor: 'darkred'
          });

          let text = layer.mapdex != -1
                        ?  mapSet[layer.mapdex].y[0].toFixed(2)
                        : " No Data";

          let div = document.getElementsByClassName("map-info");
          div[0].innerHTML = `<span><h4>Country</h4><p><b>${layer.feature.properties.label}</b> ${text}</p></span>`;

        }

        function resetHighlight(e) {
          let div = document.getElementsByClassName("map-info");
          div[0].innerHTML =  `<span><h4>Country</h4><p>Hover over a country</p></span>`; ;

          let layer = e.target;
          // console.log(layer.feature.originalColor);
          layer.setStyle({
            weight: 1,
            color: 'white',
            fillColor: layer.feature.originalColor
          });

        }

        function matchRegionName(name,f) {
          let type = selectedRegions[0].Type;
          let typeKey = regionLookup[type].key;
          let nameCheck = regionLookup[type].regions[name];
          return f.properties[typeKey] == nameCheck;
        }

        function mapDexMatchup(f, regionType) {
          switch(regionType) {
          case 'country':
            return _.findIndex(mapSet, c => { return c.name == f.properties.label;});
          case 'region':
            return _.findIndex(mapSet, c => { return matchRegionName(c.name,f);});
          default:
            return null;
          }
        }

        function onEachFeature(f, layer) {
          layer.mapdex = mapDexMatchup(f, _regionType);
          layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
          });
        }

        function chloropleth(d, rangeTop) {
          return d >= rangeTop ? '#003466' :
                 d > rangeTop * .9  ? '#174673' :
                 d > rangeTop * .75  ? '#2E5881' :
                 d > rangeTop * .5  ? '#456B8F' :
                 d > rangeTop * .25  ? '#5C7D9D' :
                 d > rangeTop * .15  ? '#7390AB' :
                 '#8BA2B9';
        }

        function getColor(f) {
          let index =  mapDexMatchup(f, _regionType);
          let color = index != -1 ? chloropleth(mapSet[index].y[0], maxValue) : "grey";
          f.originalColor = color;
          return color;
        };

        function style(feature) {
          return {
            fillColor: getColor(feature),
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
          };
        }

        // TODO create dynamic positioning based on selection
        const position = [40, -0.09];
        // TODO :
        //   Map Bounds need to be fixed location so you can't leave the view of the map when dragging
        // const outer = [
        //   [50.505, -29.09],
        //   [52.505, 29.09],
        // ];

        return(
              <Map id="map1"
                key={Math.random()}
                ref="l_map"
                // bounds={outer}
                center={position}
                zoom={2}
                minZoom={2}
                maxZoom={10} >

                <GeoJson
                  data={geoJson}
                  style={style}
                  onEachFeature={onEachFeature}
                />

                <MapDataControl />
                <MapLegendControl maxValue={this.state.maxValue} />

              </Map>
        );
      }
    }
    else{
      return <div>Map Trying to render in server -- not allowed</div>;
    }
  }

  render() {
    return this.renderNewChart();
  }
}