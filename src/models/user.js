const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  class User extends Model {}
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        isAlphanumeric: true,
        required: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        len: [7, 100],
        isEmail: true,
      },
      password: {
        type: DataTypes.STRING,
        required: true,
        allowNull: true,
        len: [8, 20],
      },
      salt: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
      paranoid: true,
      name: {
        singular: "user",
        plural: "users",
      },
    }
  );
  return User;
};
