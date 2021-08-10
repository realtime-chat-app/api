const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  class Chat extends Model {}
  Chat.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      isGroup: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        required: false,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        required: false,
        allowNull: true,
      },
      picture: {
        type: DataTypes.TEXT,
        required: false,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Chat",
      timestamps: true,
      paranoid: true,
      name: {
        singular: "chat",
        plural: "chats",
      },
    }
  );
  return Chat;
};
