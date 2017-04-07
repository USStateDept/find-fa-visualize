/**
 * Saved Visualization's Model
 *
 * @desc find.state.gov, forum, posts
 * @author Michael Ramos 
 */
'use strict';

module.exports = (sequelize, DataTypes) => {
  let saved_visualization = sequelize.define("saved_visualization", {
    saved_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    viz_name: {
      type: DataTypes.STRING
    },
    viz_setup: {
      type: DataTypes.JSON
    },
    complete: {
      type: DataTypes.BOOLEAN
    }
  });
  
  return saved_visualization;
};