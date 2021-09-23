const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  class Member extends Model {}
  Member.init(
    {},
    {
      sequelize,
      modelName: "Member",
      timestamps: true,
      paranoid: true,
      updatedAt: false,
      name: {
        singular: "member",
        plural: "members",
      },
    }
  );

  return Member;
};
