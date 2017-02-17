import _ from "lodash";

/**
 * Calculate and return Traces for averages to plot on our graphs
 * 
 * @export
 * @class AverageFactor
 */
export default class AverageFactory {
  constructor(weights, data, indicators) {
    this.dataSet = data; // data to apply weights and averages on
    this.indicators = indicators;
    this.weights = weights; // weights to apply averages on
    this.eqlAverages = {}; // equal averages to be applied
    this.popAverages = {}; // population weight averages to be applied
    this.gdpAverages = {}; // gdp weight averages to be applied
  }

  /**
   * Single Indicator
   * 
   **/
  generateAveragesForOne() {
    let self = this;

    let starterObject = {
      average: true,
      x: [],
      y: [],
      line: {
        color: "rgb(0, 0, 0)",
        dash: "dash",
        width: 4
      },
      marker: {
        color: "rgb(0,0,0)"
      }
    };

    self.eqlAverages["all"] = _.cloneDeep(starterObject);
    self.popAverages["all"] = _.cloneDeep(starterObject);
    self.gdpAverages["all"] = _.cloneDeep(starterObject);

    _.forIn(this.dataSet, function(data, key) {
      if (key !== "all") {
        // create traces
        self.eqlAverages[key] = {};
        self.popAverages[key] = {};
        self.gdpAverages[key] = {};

        let popAvgs = 0;
        let gdpAvgs = 0;
        let eqlAvgs = 0;
        let i = 0;

        let last = _.last(data.traces);
        let lastDex = _.lastIndexOf(data.traces, last);

        while (i <= lastDex) {
          if (data.traces[i]) {
            // just choose first availible date
            let date = data.traces[i].x[0];

            eqlAvgs += data.traces[i].y[0];
            popAvgs += self.calculatePopPerc(
              data.traces[i].y[0],
              data.traces[i].country_id,
              date.getFullYear()
            );
            gdpAvgs += self.calculateGdpPerc(
              data.traces[i].y[0],
              data.traces[i].country_id,
              date.getFullYear()
            );

            if (i === lastDex) {
              // single trace
              eqlAvgs = eqlAvgs / data.traces.length;

              self.eqlAverages[key].x = [date];
              self.popAverages[key].x = [date];
              self.gdpAverages[key].x = [date];
              self.eqlAverages[key].y = [eqlAvgs];
              self.popAverages[key].y = [popAvgs];
              self.gdpAverages[key].y = [gdpAvgs];
              self.eqlAverages[key].name = "No Weight Average";
              self.popAverages[key].name = "Population Average";
              self.gdpAverages[key].name = "GDP Average";

              // accumulated trace
              self.eqlAverages["all"].x.push(date);
              self.popAverages["all"].x.push(date);
              self.gdpAverages["all"].x.push(date);
              self.eqlAverages["all"].y.push(eqlAvgs);
              self.popAverages["all"].y.push(popAvgs);
              self.gdpAverages["all"].y.push(gdpAvgs);
              self.eqlAverages["all"].name = "No Weight Average";
              self.popAverages["all"].name = "Population Average";
              self.gdpAverages["all"].name = "GDP Average";

              // reset averages
              popAvgs = 0;
              gdpAvgs = 0;
              eqlAvgs = 0;
            }
          }

          i++;
        }
      }
    });

    return {
      population: this.popAverages,
      gdp: this.gdpAverages,
      equal: this.eqlAverages
    };
  }

  /**
   * Two Indicators
   * 
   **/
  generateAveragesForTwo() {
    let self = this;

    let starterObject = {
      xBubble: [],
      xScatter: [],
      y: [],
      marker: { protoSize: [] }
    };

    self.eqlAverages["all"] = _.cloneDeep(starterObject);
    self.popAverages["all"] = _.cloneDeep(starterObject);
    self.gdpAverages["all"] = _.cloneDeep(starterObject);

    _.forIn(this.dataSet, function(data, key) {
      if (key !== "all") {
        // create traces
        self.eqlAverages[key] = {};
        self.popAverages[key] = {};
        self.gdpAverages[key] = {};

        let popAvgs1 = 0;
        let gdpAvgs1 = 0;
        let eqlAvgs1 = 0;
        let popAvgs2 = 0;
        let gdpAvgs2 = 0;
        let eqlAvgs2 = 0;
        let i = 0;

        let last = _.last(data.traces);
        let lastDex = _.lastIndexOf(data.traces, last);

        while (i <= lastDex) {
          if (data.traces[i]) {
            // keep track of the working indicator value
            let idcDex = _.findIndex(self.indicators, ind => {
              return ind.id === data.traces[i].ind_id;
            });
            // just choose first availible date (bubble will hold the intial date)
            let date = data.traces[i].xBubble[0];

            // average calculations y, xScatter
            if (idcDex === 0) {
              eqlAvgs1 += data.traces[i].y[0];
              popAvgs1 += self.calculatePopPerc(
                data.traces[i].y[0],
                data.traces[i].country_id,
                date.getFullYear()
              );
              gdpAvgs1 += self.calculateGdpPerc(
                data.traces[i].y[0],
                data.traces[i].country_id,
                date.getFullYear()
              );
            }
            if (idcDex === 1) {
              eqlAvgs2 += data.traces[i].xScatter[0];
              popAvgs2 += self.calculatePopPerc(
                data.traces[i].xScatter[0],
                data.traces[i].country_id,
                date.getFullYear()
              );
              gdpAvgs2 += self.calculateGdpPerc(
                data.traces[i].xScatter[0],
                data.traces[i].country_id,
                date.getFullYear()
              );
            }

            if (i === lastDex) {
              // single trace
              eqlAvgs1 = eqlAvgs1 / data.traces.length;
              eqlAvgs2 = eqlAvgs2 / data.traces.length;

              self.eqlAverages[key].xBubble = [date];
              self.popAverages[key].xBubble = [date];
              self.gdpAverages[key].xBubble = [date];
              self.eqlAverages[key].y = [eqlAvgs1];
              self.popAverages[key].y = [popAvgs1];
              self.gdpAverages[key].y = [gdpAvgs1];
              self.eqlAverages[key].xScatter = [eqlAvgs2];
              self.popAverages[key].xScatter = [popAvgs2];
              self.gdpAverages[key].xScatter = [gdpAvgs2];
              self.eqlAverages[key].marker = {
                protoSize: [eqlAvgs2]
              };
              self.popAverages[key].marker = {
                protoSize: [popAvgs2]
              };
              self.gdpAverages[key].marker = {
                protoSize: [gdpAvgs2]
              };
              self.eqlAverages[key].name = "No Weight Average";
              self.popAverages[key].name = "Population Average";
              self.gdpAverages[key].name = "GDP Average";

              // accumulated trace
              self.eqlAverages["all"].xBubble.push(date);
              self.popAverages["all"].xBubble.push(date);
              self.gdpAverages["all"].xBubble.push(date);
              self.eqlAverages["all"].y.push(eqlAvgs1);
              self.popAverages["all"].y.push(popAvgs1);
              self.gdpAverages["all"].y.push(gdpAvgs1);
              self.eqlAverages["all"].xScatter.push(eqlAvgs2);
              self.popAverages["all"].xScatter.push(popAvgs2);
              self.gdpAverages["all"].xScatter.push(gdpAvgs2);
              self.eqlAverages["all"].marker.protoSize.push(eqlAvgs2);
              self.popAverages["all"].marker.protoSize.push(popAvgs2);
              self.gdpAverages["all"].marker.protoSize.push(gdpAvgs2);
              self.eqlAverages["all"].name = "No Weight Average";
              self.popAverages["all"].name = "Population Average";
              self.gdpAverages["all"].name = "GDP Average";

              // reset averages
              popAvgs1 = 0;
              gdpAvgs1 = 0;
              eqlAvgs1 = 0;
              popAvgs2 = 0;
              gdpAvgs2 = 0;
              eqlAvgs2 = 0;
            }
          }

          i++;
        }
      }
    });

    return {
      population: this.popAverages,
      gdp: this.gdpAverages,
      equal: this.eqlAverages
    };
  }

  /**
   * Three Indicators
   * 
   **/
  generateAveragesForThree() {
    let self = this;

    let starterObject = {
      x: [],
      y: [],
      marker: { protoSize: [] }
    };

    self.eqlAverages["all"] = _.cloneDeep(starterObject);
    self.popAverages["all"] = _.cloneDeep(starterObject);
    self.gdpAverages["all"] = _.cloneDeep(starterObject);

    _.forIn(this.dataSet, function(data, key) {
      if (key !== "all") {
        // create traces
        self.eqlAverages[key] = {};
        self.popAverages[key] = {};
        self.gdpAverages[key] = {};

        let popAvgs1 = 0;
        let gdpAvgs1 = 0;
        let eqlAvgs1 = 0;
        let popAvgs2 = 0;
        let gdpAvgs2 = 0;
        let eqlAvgs2 = 0;
        let popAvgs3 = 0;
        let gdpAvgs3 = 0;
        let eqlAvgs3 = 0;
        let i = 0;

        let last = _.last(data.traces);
        let lastDex = _.lastIndexOf(data.traces, last);

        while (i <= lastDex) {
          if (data.traces[i]) {
            let date = new Date(key);
            // keep track of the working indicator value
            let idcDex = _.findIndex(self.indicators, ind => {
              return ind.id === data.traces[i].ind_id;
            });

            // average calculations y,x,marker
            if (idcDex === 0) {
              eqlAvgs1 += data.traces[i].y[0];
              popAvgs1 += self.calculatePopPerc(
                data.traces[i].y[0],
                data.traces[i].country_id,
                date.getFullYear()
              );
              gdpAvgs1 += self.calculateGdpPerc(
                data.traces[i].y[0],
                data.traces[i].country_id,
                date.getFullYear()
              );
            }
            if (idcDex === 1) {
              eqlAvgs2 += data.traces[i].x[0];
              popAvgs2 += self.calculatePopPerc(
                data.traces[i].x[0],
                data.traces[i].country_id,
                date.getFullYear()
              );
              gdpAvgs2 += self.calculateGdpPerc(
                data.traces[i].x[0],
                data.traces[i].country_id,
                date.getFullYear()
              );
            }
            if (idcDex === 2) {
              eqlAvgs2 += data.traces[i].marker.protoSize[0];
              popAvgs2 += self.calculatePopPerc(
                data.traces[i].marker.protoSize[0],
                data.traces[i].country_id,
                date.getFullYear()
              );
              gdpAvgs2 += self.calculateGdpPerc(
                data.traces[i].marker.protoSize[0],
                data.traces[i].country_id,
                date.getFullYear()
              );
            }

            if (i === lastDex) {
              // single trace
              eqlAvgs1 = eqlAvgs1 / data.traces.length;
              eqlAvgs2 = eqlAvgs2 / data.traces.length;
              eqlAvgs3 = eqlAvgs2 / data.traces.length;

              self.eqlAverages[key].y = [eqlAvgs1];
              self.popAverages[key].y = [popAvgs1];
              self.gdpAverages[key].y = [gdpAvgs1];
              self.eqlAverages[key].x = [eqlAvgs2];
              self.popAverages[key].x = [popAvgs2];
              self.gdpAverages[key].x = [gdpAvgs2];
              self.eqlAverages[key].marker = {
                protoSize: [eqlAvgs3]
              };
              self.popAverages[key].marker = {
                protoSize: [popAvgs3]
              };
              self.gdpAverages[key].marker = {
                protoSize: [gdpAvgs3]
              };

              self.eqlAverages[key].name = "No Weight Average";
              self.popAverages[key].name = "Population Average";
              self.gdpAverages[key].name = "GDP Average";

              // accumulated trace
              self.eqlAverages["all"].y.push(eqlAvgs1);
              self.popAverages["all"].y.push(popAvgs1);
              self.gdpAverages["all"].y.push(gdpAvgs1);
              self.eqlAverages["all"].x.push(eqlAvgs2);
              self.popAverages["all"].x.push(popAvgs2);
              self.gdpAverages["all"].x.push(gdpAvgs2);
              self.eqlAverages["all"].marker.protoSize.push(eqlAvgs3);
              self.popAverages["all"].marker.protoSize.push(popAvgs3);
              self.gdpAverages["all"].marker.protoSize.push(gdpAvgs3);

              self.eqlAverages["all"].name = "No Weight Average";
              self.popAverages["all"].name = "Population Average";
              self.gdpAverages["all"].name = "GDP Average";

              // reset averages
              popAvgs1 = 0;
              gdpAvgs1 = 0;
              eqlAvgs1 = 0;
              popAvgs2 = 0;
              gdpAvgs2 = 0;
              eqlAvgs2 = 0;
              popAvgs3 = 0;
              gdpAvgs3 = 0;
              eqlAvgs3 = 0;
            }
          }
          i++;
        }
      }
    });

    return {
      population: this.popAverages,
      gdp: this.gdpAverages,
      equal: this.eqlAverages
    };
  }

  /******************/
  /* Shared Methods *
  /******************/

  calculatePopPerc(value, countryID, year) {
    let self = this;
    // find index where year === year and country === country
    let index = _.findIndex(self.weights["population"], function(o) {
      return o.Date === year && o.Country_ID === countryID;
    });
    // apply that weight and return value
    if (index !== -1) {
      return self.weights["population"][index].perc * value;
    } else {
      // do checking
      return 0;
    }
  }

  calculateGdpPerc(value, countryID, year) {
    let self = this;
    // find index where year === year and country === country
    let index = _.findIndex(self.weights["gdp"], function(o) {
      return o.Date === year && o.Country_ID === countryID;
    });
    // apply that weight and return value
    if (index !== -1) {
      return self.weights["gdp"][index].perc * value;
    } else {
      // do checking
      return 0;
    }
  }
}
