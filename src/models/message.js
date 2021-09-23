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
        // TODO: change lat and lng to DECIMAL(10,6) for improved performance
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
        get() {
          const quote = this.getDataValue("quote");
          if (quote) return JSON.parse(quote);
          else return null;
        },
        set(val) {
          if (val) this.setDataValue("quote", JSON.stringify(val));
          else this.setDataValue(null);
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

  return Message;
};
