"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const config = require(__dirname + "/../config/config.js")["environment"];
const db = {};

let sequelize = new Sequelize({
  host: config.host,
  port: config.port,
  username: config.user,
  password: config.password,
  database: config.database,
  dialect: config.dialect,
  retry: {
    max: 999,
  },
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    let fileName = `${file.slice(0, 1).toUpperCase()}${file.slice(1, -3)}`;

    if (fileName.indexOf("-") !== -1) {
      let splittedName = fileName.split("-");
      let first = splittedName[0];
      let second = splittedName[1];
      second[0] = second[0].toUpperCase();
      fileName = `${first}${second}`;
    }

    let filePath = `./${file}`;
    db[fileName] = require(filePath)(sequelize, Sequelize);
  });

module.exports = db;
