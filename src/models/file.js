const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  class File extends Model {}
  File.init(
    {
      // lastModified: {
      //   type: DataTypes.NUMBER,
      //   allowNull: false,
      // },
      // lastModifiedDate: {
      //   type: DataTypes.DATE,
      //   allowNull: false,
      //   defaultValue: Sequelize.NOW,
      // },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      src: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "File",
      timestamps: true,
      paranoid: true,
      name: {
        singular: "file",
        plural: "files",
      },
    }
  );

  const Chat = require("./chat")(sequelize, Sequelize);
  Chat.hasMany(File, { foreignKey: "chatId", sourceKey: "id" });
  File.belongsTo(Chat, { foreignKey: "chatId", sourceKey: "id" });

  const User = require("./user")(sequelize, Sequelize);
  User.hasMany(File, { foreignKey: "userId", sourceKey: "id" });
  File.belongsTo(User, { foreignKey: "userId", sourceKey: "id" });

  const Message = require("./message")(sequelize, Sequelize);
  Message.hasMany(File, { foreignKey: "messageId", sourceKey: "id" });
  Message.belongsTo(User, { foreignKey: "messageId", sourceKey: "id" });

  return Message;
};
