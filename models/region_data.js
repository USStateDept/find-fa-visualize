/**
 * Region_Data Model
 *
 * @desc find.state.gov, region_data, sequelize orm
 */
"use strict";

module.exports = (sequelize, DataTypes) => {
  let Region_Data = sequelize.define(
    "Region_Data",
    {
      Region_Data: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Indicator_ID: {
        type: DataTypes.STRING
      },
      Region_ID: {
        type: DataTypes.STRING
      },
      Year: {
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
          Region_Data.belongsTo(models.Indicator, {
            foreignKey: "Indicator_ID"
          });
          Region_Data.belongsTo(models.Region, {
            foreignKey: "Region_ID"
          });
        }
      }
    }
  );
  return Region_Data;
};
