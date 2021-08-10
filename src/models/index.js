"use strict";
const path = require("path");
const fs = require("fs");

const db = require("../config/sequelize");

const basename = path.basename(__filename);

// Import models from current directory into db instance object
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(async (file) => {
    let fileName = `${file.slice(0, 1).toUpperCase()}${file.slice(1, -3)}`;
    if (fileName.includes("-")) fileName = normalizeModelName(fileName);

    let filePath = `./${file}`;
    db[fileName] = require(filePath)(db.sequelize, db.Sequelize);
  });

// Model associations
// Chat
db.User.hasMany(db.Chat, { foreignKey: "userId", sourceKey: "id" });
db.Chat.belongsTo(db.User, { foreignKey: "userId", sourceKey: "id" });

db.User.belongsToMany(db.Chat, {
  through: "Members",
  foreignKey: "userId",
});
db.Chat.belongsToMany(db.User, {
  through: "Members",
  foreignKey: "chatId",
});

// Message
db.Chat.hasMany(db.Message, { foreignKey: "chatId", sourceKey: "id" });
db.Message.belongsTo(db.Chat, { foreignKey: "chatId", sourceKey: "id" });

db.User.hasMany(db.Message, { foreignKey: "senderId", sourceKey: "id" });
db.Message.belongsTo(db.User, { foreignKey: "senderId", sourceKey: "id" });

module.exports = db;

function normalizeModelName(fileName) {
  let splittedName = fileName.split("-");
  let first = splittedName[0];
  let second = splittedName[1];
  second[0] = second[0].toUpperCase();
  fileName = `${first}${second}`;
}
