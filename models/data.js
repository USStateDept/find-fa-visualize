/**
 * Data Model
 *
 * @desc find.state.gov, data, data fact, sequelize orm
 * @author Michael Ramos 
 */
"use strict";

module.exports = (sequelize, DataTypes) => {
  var Data = sequelize.define(
    "Data",
    {
      Data_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Date: {
        type: DataTypes.INTEGER
      },
      Value: {
        type: DataTypes.DOUBLE
      }
    },
    {
      classMethods: {
        // Executed in ./index.js
        associate: models => {
          Data.belongsTo(models.Indicator, {
            foreignKey: "Indicator_ID"
          });
          Data.belongsTo(models.Country, {
            foreignKey: "Country_ID"
          });
        }
      }
    }
  );

  return Data;
};
