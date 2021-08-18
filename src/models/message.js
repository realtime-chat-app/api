const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  class Message extends Model {}
  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
        required: true,
      },
      quoteMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        get(val) {
          this.setDataValue(JSON.parse(val));
        },
        set(val) {
          this.getDataValue(JSON.stringify(val));
        },
      },
      attachment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Message",
      timestamps: true,
      paranoid: true,
      name: {
        singular: "message",
        plural: "messages",
      },
    }
  );
  const Chat = require("./chat")(sequelize, Sequelize);
  Chat.hasMany(Message, { foreignKey: "chatId", sourceKey: "id" });
  Message.belongsTo(Chat, { foreignKey: "chatId", sourceKey: "id" });

  const User = require("./user")(sequelize, Sequelize);
  User.hasMany(Message, { foreignKey: "senderId", sourceKey: "id" });
  Message.belongsTo(User, { foreignKey: "senderId", sourceKey: "id" });

  return Message;
};
