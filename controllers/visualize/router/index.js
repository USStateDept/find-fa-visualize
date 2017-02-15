import _ from "lodash";

import models from "../../models";
import Sequelize from "sequelize";

const model = models.getModel();
const Data = model.Data;
const RegionData = model.Region_Data;
const Region = model.Region;

/**
 * @REPORT localhost/visualize/data
 */
let reportData = (req, res) => {
  let data;
  // check for multiple requests in one
  // (many charts that could be drawn on same page)
  if (Object.prototype.toString.call(req.body) != "[object Array]") {
    data = [req.body];
  } else {
    data = req.body;
  }

  getIndicatorData(data)
    .then(resultSet => {
      /** Client Response **/
      res.send(resultSet);
    })
    .catch(error => {
      console.log(error);
    });
};

/**
 * @REPORT localhost/visualize/averages
 */
let reportAverages = (req, res) => {
  let countries = req.body.countries;
  getAverageWeights(countries)
    .then(weights => {
      res.send(weights);
    })
    .catch(e => {
      console.log(e);
    });
};

let getIndicatorData = dataWantedSetup => {
  return new Promise(async (resolve, reject) => {
    let responseSet = [];
    try {
      for (let setup of dataWantedSetup) {
        let queriedSet = await queryIndicatorData(setup);
        responseSet.push(queriedSet);
      }
      return resolve(responseSet);
    } catch (e) {
      return reject(e);
    }
  });
};

let queryIndicatorData = _setup => {
  return new Promise(async (resolve, reject) => {
    let countries = [];
    let regions = [];
    let removedLocations = [];
    let availibleYears = [];
    let ctyDataSet = [];
    let regDataSet = [];
    let dataSet;
    let meta;
    let nullCheck;
    let nullAvailibility;
    // query params
    let indIds = _setup.indicators.map(ind => {
      return ind.id;
    });
    let ctyIds = _setup.countries.map(cty => {
      return cty.Country_ID;
    });
    let regIds = _setup.regions.map(reg => {
      return reg.Region_ID;
    });
    try {
      if (ctyIds.length > 0) {
        ctyDataSet = await Data.findAll({
          where: {
            Indicator_ID: indIds,
            Country_ID: ctyIds
          },
          order: '"Date" ASC'
        });
      }
      if (regIds.length > 0) {
        regDataSet = await RegionData.findAll({
          where: {
            Indicator_ID: indIds,
            Region_ID: regIds
          },
          order: '"Year" ASC'
        });
      }
      // concat data sets
      dataSet = dataSetFormation(ctyDataSet, regDataSet);
      // country checks
      _.each(_setup.countries, cty => {
        // make sure there is data in response object
        let exists = _.findIndex(dataSet, o => {
          return o.Location_ID == cty.Country_ID;
        });
        if (exists != -1) {
          countries.push(cty);
        } else {
          removedLocations.push(cty.Name);
        }
      });
      // region checks
      _.each(_setup.regions, reg => {
        // make sure there is data in response object
        let exists = _.findIndex(dataSet, o => {
          return o.Location_ID == reg.Region_ID;
        });
        if (exists != -1) {
          regions.push(reg);
        } else {
          removedLocations.push(reg.Name);
        }
      });
      meta = await model.Indicator.findAll({
        attributes: [
          "Indicator_Name",
          "Direct_Indicator_Source",
          "Original_Indicator_Source",
          "Indicator_URL",
          "Indicator_Data_URL",
          "Units",
          "Indicator_Definition"
        ],
        where: {
          Indicator_ID: indIds
        }
      });
      nullAvailibility = await performAvailibiltyCheck(_setup);
      return resolve({
        metadataSet: meta,
        dataSet: dataSet,
        countries: countries,
        regions: regions,
        indicators: _setup.indicators,
        removedLocations: removedLocations,
        nullAvailibility: nullAvailibility
      });
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
};

function formatDataValue(value) {
  if (value % 1 !== 0) {
    return parseFloat(value.toFixed(2));
  }
  return value;
}

function dataSetFormation(ctyArr, regArr) {
  let aggregateSet = _.map(ctyArr, cty => {
    return {
      Value: formatDataValue(cty.Value),
      Date: cty.Date,
      Location_ID: cty.Country_ID,
      Name: cty.Name,
      Indicator_ID: cty.Indicator_ID,
      Type: "country"
    };
  });
  return aggregateSet.concat(
    _.map(regArr, reg => {
      return {
        Value: formatDataValue(reg.Value),
        Date: reg.Year,
        Name: reg.Name,
        Location_ID: reg.Region_ID,
        Indicator_ID: reg.Indicator_ID,
        Type: "region"
      };
    })
  );
}

let nestedAvailibiltyCheck = dataWantedSetup => {
  return new Promise(async (resolve, reject) => {
    var responseSet = [];
    try {
      for (let setup of dataWantedSetup) {
        var queriedSet = await performAvailibiltyCheck(setup);
        responseSet.push(queriedSet);
      }
    } catch (e) {
      return reject(e);
    }
    return resolve(responseSet);
  });
};

let performAvailibiltyCheck = _setup => {
  return new Promise(async (resolve, reject) => {
    let indIds = _setup.indicators.map(ind => {
      return ind.id;
    });
    let ctyIds = _setup.countries.map(cty => {
      return cty.Country_ID;
    });
    let regIds = _setup.regions.map(reg => {
      return reg.Region_ID;
    });
    let ctyAvil = [];
    let regAvil = [];
    let results;
    let parsed = {
      all: {
        datapoints: 0,
        missingpoints: 0
      }
    };
    try {
      if (ctyIds.length != 0) {
        ctyAvil = await model.sequelize.query(
          `
            SELECT "Date", "Indicator_ID", COUNT(*) as data_points, ARRAY
                (
                  SELECT UNNEST(ARRAY[:ctys])
                  EXCEPT
                  SELECT UNNEST(array_agg("Country_ID"))
                ) as countries_without
            FROM "Data"
            WHERE "Country_ID" IN (:ctys)
            AND "Indicator_ID" IN (:inds)
            GROUP BY "Date", "Indicator_ID"
            ORDER BY "Date"
          `,
          {
            replacements: { ctys: ctyIds, inds: indIds },
            type: model.sequelize.QueryTypes.SELECT
          }
        );
      }
      if (regIds.length != 0) {
        regAvil = await model.sequelize.query(
          `
            SELECT "Year", "Indicator_ID", COUNT(*) as data_points, ARRAY
                (
                  SELECT UNNEST(ARRAY[:regs])
                  EXCEPT
                  SELECT UNNEST(array_agg("Region_ID"))
                ) as regions_without
            FROM "Region_Data"
            WHERE "Region_ID" IN (:regs)
            AND "Indicator_ID" IN (:inds)
            GROUP BY "Year", "Indicator_ID"
            ORDER BY "Year"
          `,
          {
            replacements: { regs: regIds, inds: indIds },
            type: model.sequelize.QueryTypes.SELECT
          }
        );
      }
      //results = ctyAvil.concat(regAvil);
      _.each(ctyAvil, (obj, i) => {
        if (_.isUndefined(parsed[obj.Date])) {
          parsed[obj.Date] = {
            includes_all_indicators: true,
            datapoints: obj.data_points,
            locations_no_data: []
          };
        }
        // indicator check
        if (indIds.length > 1) {
          let checkArray = _.filter(ctyAvil, { Date: obj.Date });
          if (indIds.length == 2 && checkArray.length != 2) {
            parsed[obj.Date].includes_all_indicators = false;
          }
          if (indIds.length == 3 && checkArray.length != 3) {
            parsed[obj.Date].includes_all_indicators = false;
          }
        }
        // country check
        _.each(ctyIds, id => {
          if (obj.countries_without.indexOf(id) != -1) {
            let i = _.findIndex(_setup.countries, c => {
              return c.Country_ID == id;
            });
            parsed[obj.Date].locations_no_data.push(
              " " + _setup.countries[i].Name
            );
          }
        });
        parsed[obj.Date].missingpoints = parsed[
          obj.Date
        ].locations_no_data.length;
        // total data points addition
        parsed["all"].datapoints += parseInt(obj.data_points, 10);
        parsed["all"].missingpoints += parsed[
          obj.Date
        ].locations_no_data.length;
      });
      // region availibility
      _.each(regAvil, (obj, i) => {
        if (_.isUndefined(parsed[obj.Year])) {
          parsed[obj.Year] = {
            includes_all_indicators: true,
            datapoints: obj.data_points,
            locations_no_data: []
          };
        }
        // indicator check
        if (indIds.length > 1) {
          let checkArray = _.filter(regAvil, { Year: obj.Year });
          if (indIds.length == 2 && checkArray.length != 2) {
            parsed[obj.Year].includes_all_indicators = false;
          }
          if (indIds.length == 3 && checkArray.length != 3) {
            parsed[obj.Year].includes_all_indicators = false;
          }
        }
        // country check
        _.each(regIds, id => {
          if (obj.regions_without.indexOf(id) != -1) {
            let i = _.findIndex(_setup.regions, r => {
              return r.Region_ID == id;
            });
            parsed[obj.Year].locations_no_data.push(
              " " + _setup.regions[i].Name
            );
          }
        });
        parsed[obj.Year].missingpoints = parsed[
          obj.Year
        ].locations_no_data.length;
        // total data points addition
        parsed["all"].datapoints += parseInt(obj.data_points, 10);
        parsed["all"].missingpoints += parsed[
          obj.Year
        ].locations_no_data.length;
      });
      return resolve(parsed);
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
};

/**
 * Parent level async func that returns differnt types of averages
 */
var getAverageWeights = countries => {
  return new Promise(async (resolve, reject) => {
    let populationWeights;
    let gdpWeights;
    try {
      populationWeights = await getPopulationWeight(countries);
      gdpWeights = await getGdpWeight(countries);
    } catch (e) {
      console.log(e);
      reject(e);
    }
    resolve({
      population: populationWeights,
      gdp: gdpWeights
    });
  });
};

function getPopulationWeight(countries) {
  return new Promise((resolve, reject) => {
    Data
      .findAll({
        attributes: [
          "Country_ID",
          "Date",
          model.sequelize.literal(
            '"Value" / sum("Value") over (PARTITION BY "Date") as perc'
          )
        ],
        where: {
          Indicator_ID: 165,
          Country_ID: countries
        },
        raw: true
      })
      .then(percentages => {
        resolve(percentages);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function getGdpWeight(countries) {
  return new Promise((resolve, reject) => {
    Data
      .findAll({
        attributes: [
          "Country_ID",
          "Date",
          model.sequelize.literal(
            '"Value" / sum("Value") over (PARTITION BY "Date") as perc'
          )
        ],
        where: {
          Indicator_ID: 219,
          Country_ID: countries
        },
        raw: true
      })
      .then(percentages => {
        resolve(percentages);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export default {
  reportData
};
