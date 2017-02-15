/**
 * Indicator Model
 *
 * @desc find.state.gov, indicators, sequelize orm
 * @author Michael Ramos
 */
"use strict";

module.exports = (sequelize, DataTypes) => {
  let Indicator = sequelize.define(
    "Indicator",
    {
      Indicator_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Indicator_Name: {
        type: DataTypes.STRING
      },
      Indicator_URL: {
        type: DataTypes.STRING(520)
      },
      Indicator_Data_URL: {
        type: DataTypes.STRING(520)
      },
      Direct_Indicator_Source: {
        type: DataTypes.STRING
      },
      Original_Indicator_Source: {
        type: DataTypes.STRING
      },
      Update_Cycle: {
        type: DataTypes.STRING
      },
      Scope: {
        type: DataTypes.STRING
      },
      Units: {
        type: DataTypes.STRING
      },
      Last_Source_Update_TS: {
        type: DataTypes.DATE
      },
      When_To_Update_TS: {
        type: DataTypes.DATE
      },
      Indicator_Definition: {
        type: DataTypes.TEXT
      },
      AVG_EQUAL: {
        type: DataTypes.BOOLEAN
      },
      AVG_POPULATION: {
        type: DataTypes.BOOLEAN
      },
      AVG_GDP: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      classMethods: {
        // Executed in ./index.js
        associate: models => {
          Indicator.belongsToMany(models.Category, {
            through: "Category_Junction",
            foreignKey: "Indicator_ID"
          });
          Indicator.belongsToMany(models.Collection, {
            through: "Collection_Junction",
            foreignKey: "Indicator_ID"
          });
          Indicator.belongsToMany(models.Data_View, {
            through: "Dataview_Junction",
            foreignKey: "Indicator_ID"
          });
          Indicator.belongsToMany(models.Data_View, {
            through: "Region_Data",
            foreignKey: "Indicator_ID"
          });
        }
      }
    }
  );

  return Indicator;
};
