const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  class LastSeen extends Model {}
  LastSeen.init(
    {},
    {
      sequelize,
      modelName: "LastSeen",
      timestamps: true,
      paranoid: true,
      name: {
        singular: "lastSeen",
        plural: "lastSeen",
      },
    }
  );

  return LastSeen;
};
