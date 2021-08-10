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
        set(value) {
          const isGroup = this.getDataValue("isGroup");
          if (isGroup && !value) throw new Error("Group title is required");
          else this.setDataValue(value);
        },
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
    }
  );
  return Chat;
};
