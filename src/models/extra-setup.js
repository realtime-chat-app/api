function applyExtraSetup(sequelize) {
  const { Chat, Member, Message, User, LastSeen } = sequelize.models;

  User.hasMany(Chat, { foreignKey: "userId", sourceKey: "id" });
  User.hasMany(Member, { foreignKey: "userId", sourceKey: "id" });
  User.hasMany(Message, { foreignKey: "senderId", sourceKey: "id" });
  User.hasMany(LastSeen, { foreignKey: "userId", sourceKey: "id" });

  Chat.hasMany(Member, { foreignKey: "chatId", sourceKey: "id" });
  Chat.hasMany(Message, { foreignKey: "chatId", sourceKey: "id" });
  Chat.hasMany(LastSeen, { foreignKey: "chatId", sourceKey: "id" });
  Chat.belongsTo(User, { foreignKey: "userId", sourceKey: "id" });

  Member.belongsTo(Chat, { foreignKey: "chatId", sourceKey: "id" });
  Member.belongsTo(User, { foreignKey: "userId", sourceKey: "id" });

  Message.belongsTo(Chat, { foreignKey: "chatId", sourceKey: "id" });
  Message.belongsTo(User, { foreignKey: "senderId", sourceKey: "id" });

  LastSeen.belongsTo(User, { foreignKey: "userId", sourceKey: "id" });
  LastSeen.belongsTo(Chat, { foreignKey: "chatId", sourceKey: "id" });
}

module.exports = { applyExtraSetup };
