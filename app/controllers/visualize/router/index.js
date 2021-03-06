import _ from "lodash";

import models from "../../../models";
import Sequelize from "sequelize";

const model = models.getModel();
const Data = model.Data;
const RegionData = model.Region_Data;
const Region = model.Region;
const SV = model.saved_visualization;

/**
 * reports data needed for visualizations. Given indicators and countries, the function will return
 * the requested data in country,year,value
 * 
 */
let reportData = (req, res) => {
  let data;
  // check for multiple requests in one
  // (many charts that could be drawn on same page)
  if (Object.prototype.toString.call(req.body) !== "[object Array]") {
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
 * Reports back different type of averages given indicators and countries for a total timespan 
 * 
 */
let reportAverages = (req, res) => {
  let countries = req.body.countries;
  getAverageWeights(countries)
    .then(weights => {
      res.send(weights);
    })
    .catch(e => {
      res.send(e);
    });
};

/**
 * @GET localhost/visualize/save/:id
 */
let getSavedViz = (req, res) => {
    SV.findById(req.params.id)
    .then( json => {
        // -- response --
        res.json(json)
        // -- response --
    }).catch( err => {
        res.send(err);
    })
};

 /**
 * @POST localhost/visualize/save
 */
let postSavedViz = (req, res) => {
    // response object
    var resBody = {};
    // lets check and see if email already exists first
    // db will return null when not found
    
    var toSave = SV.build({
        viz_setup: req.body.viz_setup,
        viz_name: req.body.viz_name,
        complete: "t",
        user_id: req.body.user_id
    })
    toSave.save().then( sv => {
        resBody = {saved:true, id: sv.saved_id}
        // -- response --
        res.json(resBody)
        // -- response --
    }).catch( err =>  {
        res.send(err);
    })
};

async function getIndicatorData(dataWantedSetup) {
  let responseSet = [];
  try {
    for (let setup of dataWantedSetup) {
      let queriedSet = await queryIndicatorData(setup);
      responseSet.push(queriedSet);
    }
    return responseSet;
  } catch (e) {
    console.log(e);
  }
}

async function queryIndicatorData(_setup) {
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
      if(_setup.yearRange == undefined) {
        _setup.yearRange = [];
      }
      if (_setup.yearRange.length > 0) {
        ctyDataSet = await Data.findAll({
          where: {
            Indicator_ID: indIds,
            Country_ID: ctyIds,
            Date: _setup.yearRange
          },
          order: '"Date" ASC'
        });
      } else {
        ctyDataSet = await Data.findAll({
          where: {
            Indicator_ID: indIds,
            Country_ID: ctyIds
          },
          order: '"Date" ASC'
        });
      }
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
        return o.Location_ID === cty.Country_ID;
      });
      if (exists !== -1) {
        countries.push(cty);
      } else {
        removedLocations.push(cty.Name);
      }
    });
    // region checks
    _.each(_setup.regions, reg => {
      // make sure there is data in response object
      let exists = _.findIndex(dataSet, o => {
        return o.Location_ID === reg.Region_ID;
      });
      if (exists !== -1) {
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
    return {
      metadataSet: meta,
      dataSet: dataSet,
      countries: countries,
      regions: regions,
      indicators: _setup.indicators,
      removedLocations: removedLocations,
      nullAvailibility: nullAvailibility
    };
  } catch (err) {
    console.log(err);
  }
}

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

async function nestedAvailibiltyCheck(dataWantedSetup) {
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
}

async function performAvailibiltyCheck(_setup) {
  let indIds = _setup.indicators.map(ind => {
    return ind.id;
  });
  let ctyIds = _setup.countries.map(cty => {
    return cty.Country_ID;
  });
  if(_setup.regions && _setup.regions.length != 0){
    let regIds = _setup.regions.map(reg => {
      return reg.Region_ID;
    });
  }
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
    if (ctyIds.length !== 0) {
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
    /*if(_setup.regions != undefined) {
      if (regIds.length !== 0) {
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
    }*/
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
        if (indIds.length === 2 && checkArray.length != 2) {
          parsed[obj.Date].includes_all_indicators = false;
        }
        if (indIds.length === 3 && checkArray.length != 3) {
          parsed[obj.Date].includes_all_indicators = false;
        }
      }
      // country check
      _.each(ctyIds, id => {
        if (obj.countries_without.indexOf(id) != -1) {
          let i = _.findIndex(_setup.countries, c => {
            return c.Country_ID === id;
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
      parsed["all"].missingpoints += parsed[obj.Date].locations_no_data.length;
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
        if (indIds.length === 2 && checkArray.length != 2) {
          parsed[obj.Year].includes_all_indicators = false;
        }
        if (indIds.length === 3 && checkArray.length != 3) {
          parsed[obj.Year].includes_all_indicators = false;
        }
      }
      // country check
      /*_.each(regIds, id => {
        if (obj.regions_without.indexOf(id) != -1) {
          let i = _.findIndex(_setup.regions, r => {
            return r.Region_ID === id;
          });
          parsed[obj.Year].locations_no_data.push(" " + _setup.regions[i].Name);
        }
      });*/
      parsed[obj.Year].missingpoints = parsed[
        obj.Year
      ].locations_no_data.length;
      // total data points addition
      parsed["all"].datapoints += parseInt(obj.data_points, 10);
      parsed["all"].missingpoints += parsed[obj.Year].locations_no_data.length;
    });
    return parsed;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Parent level async func that returns differnt types of averages
 */
async function getAverageWeights(countries) {
  let populationWeights;
  let gdpWeights;
  try {
    populationWeights = await getPopulationWeight(countries);
    gdpWeights = await getGdpWeight(countries);

    return {
      population: populationWeights,
      gdp: gdpWeights
    };
  } catch (e) {
    console.log(e);
  }
}

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
  reportData,
  reportAverages,
  getSavedViz,
  postSavedViz
};