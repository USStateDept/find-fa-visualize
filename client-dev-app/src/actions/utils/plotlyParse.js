import _ from "lodash";

/**
 * Parsing incoming data for plotly charts
 * 
 * @export
 * @class Parse
 */
export default class Parse {
  constructor(query_results) {
    this.dataSet = query_results.dataSet; // the full data unparsed
    this.countries = query_results.countries; // country object subname,id
    this.regions = query_results.regions; // country object subname,id
    this.regionPad = query_results.countries.length;
    this.indicators = query_results.indicators; // indicators
    this.removed = query_results.removedLocations; // these are countries that were selected, but have no data
    this.metadataSet = query_results.metadataSet; // metadata for indicators
    this.nullAvailibility = query_results.nullAvailibility;
    this.dataTableSet = {}; // returned structure for data table
    this.chartData = {}; // returned structure for charts
    this.common = {}; // common values such as totals, years
    this.mapSet = {}; // used for map viz
    this.simpleSet = []; // used for creating map set
    this.scale = 0; // this is needed for some bubble scaling options
    this.retObj = {}; // parent level return object
    this.shouldChartRender = true; // if ever false, plotly wont render the chart, usually because of null values
  }

  nullValuesDataCheck() {
    let self = this;
    _.each(self.indicators, ind => {
      let idcDex = _.findIndex(self.dataSet, data => {
        return data.Indicator_ID === ind.id;
      });

      if (idcDex === -1) {
        self.shouldChartRender = false;
      }
    });
  }

  /**
   * Reverses the current indicator order,
   * this is needed for when a user needs to switch axis'scale
   */
  reverseIndicatorOrder() {
    let removed = this.indicators.splice(0, 1);
    this.indicators.push(removed[0]);
  }

  /**
   * Genrates keys that parsing would need, 
   * dependent on location type
   */
  generateLocationKeys(obj) {
    let locDex, locId, locName;

    if (obj.Type === "region") {
      locDex = _.findIndex(this.regions, r => {
        return r.Region_ID === obj.Location_ID;
      });
      locName = this.regions[locDex].Name;
      locId = this.regions[locDex].Region_ID;
    }

    if (obj.Type === "country") {
      locDex = _.findIndex(this.countries, c => {
        return c.Country_ID === obj.Location_ID;
      });
      locName = this.countries[locDex].Name;
      locId = this.countries[locDex].Country_ID;
    }

    return {
      locDex,
      locName,
      locId
    };
  }

  /**
   * 
   *
   */
  createDataTableRow(obj, locName, idcName) {
    // make sure we have object for each region for the data table
    _.each(
      this.regions,
      r => {
        if (r !== "__PAD__") {
          let rname = r.Name;
          if (_.isUndefined(this.dataTableSet[rname])) {
            this.dataTableSet[rname] = {};
          }
          if (_.isUndefined(this.dataTableSet[rname][idcName])) {
            this.dataTableSet[rname][idcName] = {};
          }
          if (_.isUndefined(this.dataTableSet[rname][idcName][obj.Date])) {
            this.dataTableSet[rname][idcName][obj.Date] = null;
          }
        }
      },
      this
    );

    // make sure we have object for each country for the data table
    _.each(
      this.countries,
      c => {
        let cname = c.Name;
        if (_.isUndefined(this.dataTableSet[cname])) {
          this.dataTableSet[cname] = {};
        }
        if (_.isUndefined(this.dataTableSet[cname][idcName])) {
          this.dataTableSet[cname][idcName] = {};
        }
        if (_.isUndefined(this.dataTableSet[cname][idcName][obj.Date])) {
          this.dataTableSet[cname][idcName][obj.Date] = null;
        }
      },
      this
    );

    // can easily add value to datatable set now
    this.dataTableSet[locName][idcName][obj.Date] = obj.Value;
  }

  adjustMultiLocationPad() {
    if (this.regions.length > 0 && this.countries.length > 0) {
      let i = this.regionPad;
      while (i--) {
        this.regions.unshift("__PAD__");
      }
    }
  }

  /**
   * Parse data from one selected indicator
   * 
   * @returns {obj} object needed for 1x indicator charts
   */
  parseForOne() {
    // inits
    this.adjustMultiLocationPad();

    // ** common values and top level data structure **
    this.common.totals = [];
    this.common.maxValue = 0;
    this.common.years = []; // years current data has

    // top level data structure all charts use intiailly
    let _cd = this.chartData;
    _cd.all = {};
    _cd.all.traces = [];

    // PARSE LOOP
    _.each(
      this.dataSet,
      obj => {
        let idcDex = _.findIndex(this.indicators, i => {
          return i.id === obj.Indicator_ID;
        });
        let idcName = this.indicators[idcDex].name;

        let {
          locDex,
          locName,
          locId
        } = this.generateLocationKeys(obj);

        // ** Individual Full Set  **
        // create traces for full data sets (all years combined)
        if (_.isUndefined(_cd.all.traces[locDex])) {
          // indv inits
          _cd.all.traces[locDex] = { x: [], y: [] };
          _cd.all.traces[locDex].text = idcName;
          _cd.all.traces[locDex].name = locName;

          // create a new total row representing this country
          this.common.totals[locDex] = 0;
        }

        // now push x and y values onto arrays for top level
        _cd.all.traces[locDex].x.push(new Date(obj.Date, 1, 1));
        _cd.all.traces[locDex].y.push(obj.Value);

        // ** Individual Yearly Breakup **
        // create traces for each year - to be used for time slider
        if (_.isUndefined(_cd[obj.Date])) {
          // trace inits
          _cd[obj.Date] = {};
          _cd[obj.Date].traces = [];
          // unique year pushed into commons
          this.common.years.push(obj.Date);
        }

        // create traces for individual countries now
        if (_.isUndefined(_cd[obj.Date].traces[locDex])) {
          _cd[obj.Date].traces[locDex] = {};
          _cd[obj.Date].traces[locDex].text = idcName;
          _cd[obj.Date].traces[locDex].name = locName;
          _cd[obj.Date].traces[locDex].country_id = locId;
          _cd[obj.Date].traces[locDex].x = [];
          _cd[obj.Date].traces[locDex].y = [];
        }

        // now push x and y values onto arrays for single year
        _cd[obj.Date].traces[locDex].x.push(new Date(obj.Date, 1, 1));
        _cd[obj.Date].traces[locDex].y.push(obj.Value);

        // ** Data Table **
        this.createDataTableRow(obj, locName, idcName);

        // add to collected total
        this.common.totals[locDex] += obj.Value;
        // do max value check
        if (obj.Value > this.common.maxValue) {
          this.common.maxValue = obj.Value;
        }
      },
      this
    );

    // ** map **
    // the map needs (for now) averages of the data
    // this was already calculated for us when parsing for
    // the line set
    this.mapSet.data = [];
    // now populate the set
    _.each(
      this.common.totals,
      (total, i) => {
        this.mapSet.data.push({
          name: (
            this.countries[i] ? this.countries[i].Name : this.regions[i].Name
          ),
          average: total / _cd.all.traces[i].y.length
        });
        this.simpleSet.push(total / _cd.all.traces[i].y.length);
      },
      this
    );

    // reverse years array and add 'all'
    this.common.years.push("all");

    // final object
    this.retObj = {
      chartData: this.chartData,
      listYears: this.common.years,
      countries: this.countries,
      regions: this.regions,
      maxValue: this.common.maxValue,
      nullAvailibility: this.nullAvailibility,
      indicators: this.indicators,
      removedLocations: this.removed,
      mapSet: this.mapSet.data,
      simpleSet: this.simpleSet,
      metadataSet: this.metadataSet,
      dataTableSet: this.dataTableSet,
      dataSet: this.dataSet,
      shouldChartRender: this.shouldChartRender
    };

    return this.retObj;
  }

  /**
   * Parse data from two selected indicators
   * 
   * @returns {object} needed for 2x indicator charts
   */
  parseForTwo() {
    // inits
    this.adjustMultiLocationPad();

    // ** common values and top level data structure **
    this.common.years = [];

    // ** define new traces array **
    // top level data structure all charts use intiailly
    let _cd = this.chartData;
    _cd.all = {};
    _cd.all.traces = [];

    // values used for scaling bubble
    let secTotals = 0;
    let secCount = 0;

    // PARSE LOOP
    _.each(
      this.dataSet,
      obj => {
        // we are going to want to work with location and indicators here
        let {
          locDex,
          locName,
          locId
        } = this.generateLocationKeys(obj);

        let idcDex = _.findIndex(this.indicators, i => {
          return i.id === obj.Indicator_ID;
        });
        let idcName = this.indicators[idcDex].name;

        // ** scale values for bubble **
        // index is going to be 1, (second indicator)
        if (idcDex === 1) {
          secTotals += obj.Value;
          secCount += 1;
        }

        // ** Full Set  **
        // create traces for full data sets (all years combined)
        if (_.isUndefined(_cd.all.traces[locDex])) {
          _cd.all.traces[locDex] = {
            xBubble: [],
            xScatter: [],
            y: [],
            marker: { protoSize: [] },
            name: locName
          };
        }
        // now push x and y values onto array (for one indicator)
        if (idcDex === 0) {
          _cd.all.traces[locDex].y.push(obj.Value);
        }
        if (idcDex === 1) {
          _cd.all.traces[locDex].xScatter.push(obj.Value);
          _cd.all.traces[locDex].marker.protoSize.push(obj.Value);
        }

        // ** Individual Yearly Breakup **
        // create traces for each year - to be used for time slider
        if (_.isUndefined(_cd[obj.Date])) {
          // trace inits
          _cd[obj.Date] = {};
          _cd[obj.Date].traces = [];
          // this date is unique, so add it to commons
          this.common.years.push(obj.Date);
          // bubble-x for all gets pushed here -- going to be one date for time axis
          _cd.all.traces[locDex].xBubble.push(new Date(obj.Date, 1, 1));
        }

        // create traces for individual countries now
        if (_.isUndefined(_cd[obj.Date].traces[locDex])) {
          _cd[obj.Date].traces[locDex] = {};
          _cd[obj.Date].traces[locDex].marker = {};
          _cd[obj.Date].traces[locDex].marker.protoSize = [];
          _cd[obj.Date].traces[locDex].name = locName;
          _cd[obj.Date].traces[locDex].text = obj.Date;
          _cd[obj.Date].traces[locDex].xBubble = [];
          _cd[obj.Date].traces[locDex].xScatter = [];
          _cd[obj.Date].traces[locDex].y = [];
          _cd[obj.Date].traces[locDex].country_id = locId;
          _cd[obj.Date].traces[locDex].ind_id = this.indicators[idcDex].id;
          // bubble-x gets pushed here -- going to be one date for time axis
          _cd[obj.Date].traces[locDex].xBubble.push(new Date(obj.Date, 1, 1));
        }

        // now push x and y values onto array (for one indicator)
        if (idcDex === 0) {
          _cd[obj.Date].traces[locDex].y.push(obj.Value);
        }
        if (idcDex === 1) {
          _cd[obj.Date].traces[locDex].xScatter.push(obj.Value);
          _cd[obj.Date].traces[locDex].marker.protoSize.push(obj.Value);
        }

        this.createDataTableRow(obj, locName, idcName);
      },
      this
    );

    // get bubble scale
    this.scale = secTotals / secCount;
    this.scale = this._defineScale(this.scale);

    // reverse years array and add 'all'
    this.common.years.push("all");

    // final object
    this.retObj = {
      chartData: this.chartData,
      countries: this.countries,
      regions: this.regions,
      indicators: this.indicators,
      removedLocations: this.removed,
      metadataSet: this.metadataSet,
      nullAvailibility: this.nullAvailibility,
      scale: this.scale,
      dataTableSet: this.dataTableSet,
      listYears: this.common.years,
      dataSet: this.dataSet,
      shouldChartRender: this.shouldChartRender
    };

    return this.retObj;
  }

  /**
   * Parse data from three selected indicators
   * 
   * @returns {object} needed for 3x charts
   */
  parseForThree() {
    // inits
    this.adjustMultiLocationPad();

    // ** common values and top level data structure **
    this.common.years = []; // years current data has

    // ** Define new traces array **
    // top level data structure all charts use intiailly
    let _cd = this.chartData;
    _cd.all = {};
    _cd.all.traces = [];

    let secTotals = 0;
    let secCount = 0;

    // PARSE LOOP
    _.each(
      this.dataSet,
      obj => {
        // we are going to want to work with countries and indicators here
        let idcDex = _.findIndex(this.indicators, i => {
          return i.id === obj.Indicator_ID;
        });
        let idcName = this.indicators[idcDex].name;

        let {
          locDex,
          locName,
          locId
        } = this.generateLocationKeys(obj);

        // calculate totals ** used for scaling
        // inddex is going to be 1, (second indicator)
        if (idcDex === 2) {
          secTotals += obj.Value;
          secCount += 1;
        }

        // ** full set **
        if (_.isUndefined(_cd.all.traces[locDex])) {
          _cd.all.traces[locDex] = {
            x: [],
            y: [],
            marker: { protoSize: [] },
            text: this.indicators[2].name,
            name: locName
          };
        }

        // now push x and y values onto arraya (for one indicator)
        if (idcDex === 0) {
          _cd.all.traces[locDex].y.push(obj.Value);
        }
        if (idcDex === 1) {
          _cd.all.traces[locDex].x.push(obj.Value);
        }
        if (idcDex === 2) {
          _cd.all.traces[locDex].marker.protoSize.push(obj.Value);
        }

        // ** Individual Yearly Breakup **
        // create traces for each year - to be used for time slider
        if (_.isUndefined(_cd[obj.Date])) {
          _cd[obj.Date] = {};
          _cd[obj.Date].traces = [];
          // unique year addition
          this.common.years.push(obj.Date);
        }

        // create traces for individual countries now
        if (_.isUndefined(_cd[obj.Date].traces[locDex])) {
          _cd[obj.Date].traces[locDex] = {};
          _cd[obj.Date].traces[locDex].x = [];
          _cd[obj.Date].traces[locDex].y = [];
          _cd[obj.Date].traces[locDex].marker = {};
          _cd[obj.Date].traces[locDex].marker.protoSize = [];
          _cd[obj.Date].traces[locDex].text = this.indicators[2].name; // the third & bubble area
          _cd[obj.Date].traces[locDex].name = locName;
          _cd[obj.Date].traces[locDex].country_id = locId;
          _cd[obj.Date].traces[locDex].ind_id = this.indicators[idcDex].id;
        }

        // now push x and y values onto arrays (for indicator 1,2 or 3)
        if (idcDex === 0) {
          _cd[obj.Date].traces[locDex].y.push(obj.Value);
        }
        if (idcDex === 1) {
          _cd[obj.Date].traces[locDex].x.push(obj.Value);
        }
        if (idcDex === 2) {
          _cd[obj.Date].traces[locDex].marker.protoSize.push(obj.Value);
        }

        this.createDataTableRow(obj, locName, idcName);
      },
      this
    );

    // get scale
    this.scale = secTotals / secCount;
    this.scale = this._defineScale(this.scale);

    // reverse years array and add 'all'
    this.common.years.push("all");

    // final object
    this.retObj = {
      chartData: this.chartData,
      countries: this.countries,
      regions: this.regions,
      indicators: this.indicators,
      removedLocations: this.removed,
      nullAvailibility: this.nullAvailibility,
      metadataSet: this.metadataSet,
      scale: this.scale,
      dataTableSet: this.dataTableSet,
      listYears: this.common.years,
      dataSet: this.dataSet,
      shouldChartRender: this.shouldChartRender
    };
    return this.retObj;
  }

  /**
   * Finds a scale value for bubble by comparring values with
   * pre-defined numbers that scale should fall under
   * 
   * @param {num} num number to base scale off of
   * @returns {num} scale
   */
  _defineScale(num) {
    let arr = [
      -10,
      -1,
      -0.01,
      0,
      0.01,
      1,
      10,
      100,
      1000,
      100000,
      10000000,
      100000000,
      1000000000,
      1500000000,
      2000000000,
      5000000000,
      10000000000
    ];
    let curr = arr[0];
    let currI = 0;
    let diff = Math.abs(num - curr);
    let i = arr.length;
    while (i--) {
      let newDiff = Math.abs(num - arr[i]);
      if (newDiff < diff) {
        diff = newDiff;
        curr = arr[i];
        currI = i;
      }
    }
    return currI;
  }
}
