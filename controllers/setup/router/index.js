import _ from "lodash";
import models from "../../../models";

let model = models.getModel();

let getIndicators = (req, res) => {
  model.Indicator
    .findAll({
      attributes: [
        "Indicator_ID",
        "Indicator_Name",
        "Indicator_URL",
        "Indicator_Data_URL",
        "Direct_Indicator_Source",
        "Original_Indicator_Source",
        "Units",
        "updatedAt",
        "Indicator_Definition"
      ]
    })
    .then(function(data) {
      res.json(data);
    });
};

let getWizardMenuSetup = (req, res) => {
  collectAllForWizardMenuSetup()
    .then(resObj => {
      res.json(resObj);
    })
    .catch(err => {
      console.log(err);
      res.json({ error: true, message: err });
    });
};

let getIngestMenuSetup = (req, res) => {
  collectAllForIngestMenu()
    .then(resObj => {
      res.json(resObj);
    })
    .catch(err => {
      console.log(err);
      res.json({ error: true, message: err });
    });
};

let getGeojson = (req, res) => {
  let mapType = req.params.type;
  res.sendFile(
    path.resolve(__dirname + "/../../public/geo/" + mapType + "_map.geojson")
  );
};

async function collectAllForWizardMenuSetup() {
  let response = {};
  let unsortedCategories;

  try {
    // query categories
    unsortedCategories = await getCombinedCategories();
    // sort categories
    response.indicatorSetup = sortCategories(unsortedCategories);
    // query countries
    response.countriesSetup = await getCountries();
  } catch (e) {
    console.log(e);
  }

  return response;
}

async function collectAllForIngestMenu() {
  let res = {};
  let unsortedCategories;

  try {
    // query categories
    unsortedCategories = await getCombinedCategories();
    // sort categories
    res.categories = sortCategories(unsortedCategories);
    // all indicators
    res.indicators = await getIndicators();
  } catch (e) {
    return reject(e);
  }

  if (res.categories.length > 0) {
    return res;
  } else {
    return "Uncaught Error";
  }
}

function getCombinedCategories() {
  return new Promise((resolve, reject) => {
    // First grab and structure the categories and indicators
    model.sequelize
      .query(
        `
        SELECT public."Categories"."Category_Name", public."Categories"."Category_ID", public."Categories"."Sub_Category_Name",
        public."Indicators"."Indicator_Name", public."Indicators"."Indicator_ID", public."Indicators"."AVG_EQUAL", public."Indicators"."AVG_GDP", public."Indicators"."AVG_POPULATION"
        FROM public."Category_Junction" 
        JOIN public."Indicators" ON public."Category_Junction"."Indicator_ID" = public."Indicators"."Indicator_ID"  
        JOIN public."Categories" ON public."Category_Junction"."Category_ID" = public."Categories"."Category_ID" 
        ORDER BY public."Categories"."Category_Name" DESC
      `,
        {
          type: model.sequelize.QueryTypes.SELECT
        }
      )
      .then(combined => {
        return resolve(combined);
      })
      .catch(err => {
        return reject(err);
      });
  });
}

function sortCategories(combined) {
  // we now need to parse the query results to get the structure we need
  // instantiate the final array
  let categories = [];

  for (let i = combined.length - 1; i >= 0; i--) {
    let catname = combined[i].Category_Name,
      catID = combined[i].Category_ID,
      indname = combined[i].Indicator_Name,
      indID = combined[i].Indicator_ID,
      indAvgEql = combined[i].AVG_EQUAL,
      indAvgGdp = combined[i].AVG_GDP,
      indAvgPop = combined[i].AVG_POPULATION,
      subname = combined[i].Sub_Category_Name;

    let index = categories
      .map(c => {
        return c.name;
      })
      .indexOf(catname);
    if (index != -1) {
      // category exists already, now we need to check if subcategory exists
      let subdex = categories[index].subcategories
        .map(s => {
          return s.name;
        })
        .indexOf(subname);
      if (subdex != -1) {
        // sub cat exists, just add the indicator
        categories[index].subcategories[subdex].indicators.push({
          name: indname,
          id: indID,
          avgEql: indAvgEql,
          avgGdp: indAvgGdp,
          avgPop: indAvgPop
        });
      } else {
        // sub cat does not exist, add entire
        let addSub = {
          name: subname,
          id: catID,
          indicators: []
        };
        addSub.indicators.push({
          name: indname,
          id: indID,
          avgEql: indAvgEql,
          avgGdp: indAvgGdp,
          avgPop: indAvgPop
        });
        categories[index].subcategories.push(addSub);
      }
    } else {
      // that category does not yet exist, add it, subcategory, and indicator
      let addSub = {
        name: subname,
        id: catID,
        indicators: []
      };
      addSub.indicators.push({
        name: indname,
        id: indID,
        avgEql: indAvgEql,
        avgGdp: indAvgGdp,
        avgPop: indAvgPop
      });
      // now add to new cat
      let addCat = {
        name: catname,
        subcategories: []
      };
      addCat.subcategories.push(addSub);
      // now push to array
      categories.push(addCat);
    }
  }

  return categories;
}

function getIndicators() {
  return new Promise((resolve, reject) => {
    model.Indicator
      .findAll()
      .then(indicators => {
        return resolve(indicators);
      })
      .catch(err => {
        return reject(e);
      });
  });
}

function getCountries() {
  return new Promise((resolve, reject) => {
    // indicators collected, now get countries
    model.Country
      .findAll({
        attributes: [
          "Name",
          "ISO",
          "Country_ID",
          "Continent",
          "DOD_Group",
          "DOS_Group",
          "USAID_Group",
          "INCOME_Group"
        ],
        group: ["Name", "ISO", "Country_ID"],
        order: ["Name"]
      })
      .then(countries => {
        model.Region
          .findAll({
            attributes: ["Name", "Region_ID", "Type", "Type_Long"],
            group: ["Name", "Region_ID"],
            order: ["Type"]
          })
          .then(regions => {
            let regionList = [];
            _.each(regions, row => {
              let typeDex = _.findIndex(regionList, r => {
                return r.name === row.Type_Long;
              });
              if (typeDex === -1) {
                typeDex = regionList.push({ name: row.Type_Long, list: [] }) -
                  1;
              }
              regionList[typeDex].list.push(row);
            });

            return resolve(
              [{ name: "All", list: countries }].concat(regionList)
            );
          })
          .catch(err => {
            return reject(err);
          });
      })
      .catch(err => {
        return reject(err);
      });
  });
}

export default {
  getIndicators,
  getWizardMenuSetup,
  getIngestMenuSetup,
  getGeojson
};
