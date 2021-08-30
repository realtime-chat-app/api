"use strict";
const path = require("path");
const fs = require("fs");

const db = require("../config/sequelize");
const { applyExtraSetup } = require("./extra-setup");

const basename = path.basename(__filename);

// Import models from current directory into db instance object
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      !file.includes("extra-setup") &&
      file !== basename &&
      file.slice(-3) === ".js"
    );
  })
  .forEach(async (file) => {
    let fileName = `${file.slice(0, 1).toUpperCase()}${file.slice(1, -3)}`;
    if (fileName.includes("-")) fileName = normalizeModelName(fileName);

    let filePath = `./${file}`;
    db[fileName] = require(filePath)(db.sequelize, db.Sequelize);
  });

applyExtraSetup(db.sequelize);

module.exports = db;

function normalizeModelName(fileName) {
  let splittedName = fileName.split("-");
  let first = splittedName[0];
  let second = splittedName[1];
  second = `${second[0].toUpperCase()}${second.substr(1, second.length)}`;
  fileName = `${first}${second}`;
}
