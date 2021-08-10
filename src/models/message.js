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
    }
  );
  return Message;
};
