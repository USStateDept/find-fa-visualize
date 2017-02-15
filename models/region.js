/**
 * Regions Model
 *
 * @desc find.state.gov, regions, sequelize orm
 */
"use strict";

module.exports = (sequelize, DataTypes) => {
  let Region = sequelize.define(
    "Region",
    {
      Region_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Name: {
        type: DataTypes.STRING
      },
      Type: {
        type: DataTypes.STRING
      },
      Type_Long: {
        type: DataTypes.STRING
      }
    },
    {
      createdAt: false,
      updatedAt: false,
      classMethods: {
        // Executed in ./index.js
        associate: models => {
          Region.belongsToMany(models.Region_Data, {
            through: "Region_Data",
            foreignKey: "Region_ID"
          });
        }
      }
    }
  );

  return Region;
};
