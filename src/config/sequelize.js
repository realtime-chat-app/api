"use strict";
const Sequelize = require("sequelize");

const { production, development } = require("./environment");

const config = getConfig();
const sequelize = new Sequelize({
  host: config.host,
  port: config.port,
  username: config.user,
  password: config.password,
  database: config.database,
  dialect: config.dialect,
  retry: {
    max: 999,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

function getConfig() {
  if (process.env.NODE_ENV?.toLowerCase() === "production") return production;
  else return development;
}
