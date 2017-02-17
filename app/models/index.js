/**
 * Models - Index
 *
 * @desc Index Class, purpose is to setup and sync the models.
 * Executed in the server initiation. Be careful making edits
 * to this file
 * @author Michael Ramos 
 */
"use strict";

import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
let env = process.env.NODE_ENV || "development";

// base object
let model;

module.exports.init = dbconfig => {
  let sequelize = new Sequelize(
    dbconfig.name,
    dbconfig.username,
    dbconfig.password,
    dbconfig.settings
  );
  let db = {};

  fs
    .readdirSync(__dirname)
    .filter(file => {
      return file.indexOf(".") !== 0 && file !== "index.js";
    })
    .forEach(file => {
      let model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if ("associate" in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  model = db;
};

module.exports.getModel = () => {
  return model;
};
