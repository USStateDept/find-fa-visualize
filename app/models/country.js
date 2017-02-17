/**
 * Country Model
 *
 * @desc find.state.gov, countries, sequelize orm
 * @author Michael Ramos 
 */
"use strict";

module.exports = (sequelize, DataTypes) => {
  let Country = sequelize.define(
    "Country",
    {
      Country_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Country_Name: {
        type: DataTypes.STRING
      },
      Name: {
        type: DataTypes.STRING
      },
      Continent: {
        type: DataTypes.STRING
      },
      DOD_Group: {
        type: DataTypes.STRING
      },
      DOS_Group: {
        type: DataTypes.STRING
      },
      USAID_Group: {
        type: DataTypes.STRING
      },
      INCOME_Group: {
        type: DataTypes.STRING
      },
      ISO: {
        type: DataTypes.STRING
      },
      Country_Geography: {
        type: DataTypes.GEOMETRY("MULTIPOLYGON")
      }
    },
    {
      createdAt: false,
      updatedAt: false,
      classMethods: {
        // Executed in ./index.js
        associate: models => {
          Country.hasMany(models.Country_Altname, {
            foreignKey: "Country_ID"
          });
        }
      }
    }
  );

  return Country;
};
