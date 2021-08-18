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

  const User = require("./user")(sequelize, Sequelize);
  User.hasMany(Member, { foreignKey: "userId", sourceKey: "id" });
  Member.belongsTo(User, { foreignKey: "userId", sourceKey: "id" });

  const Chat = require("./chat")(sequelize, Sequelize);
  Chat.hasMany(Member, { foreignKey: "chatId", sourceKey: "id" });
  Member.belongsTo(Chat, { foreignKey: "chatId", sourceKey: "id" });

  return Member;
};
