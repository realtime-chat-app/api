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
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      reply: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quote: {
        type: DataTypes.TEXT,
        allowNull: true,
        get(val) {
          this.setDataValue(JSON.parse(val));
        },
        set(val) {
          this.getDataValue(JSON.stringify(val));
        },
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
