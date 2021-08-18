const { DataTypes, Model } = require("sequelize");

// class Chat extends Model {
//   static init(sequelize, DataTypes = dataTypes) {
//     return super.init(
//       {
//         id: {
//           type: DataTypes.UUID,
//           primaryKey: true,
//           defaultValue: DataTypes.UUIDV4,
//         },
//         isGroup: {
//           type: DataTypes.BOOLEAN,
//           defaultValue: false,
//           allowNull: false,
//         },
//         title: {
//           type: DataTypes.STRING,
//           required: false,
//           allowNull: true,
//         },
//         description: {
//           type: DataTypes.STRING,
//           required: false,
//           allowNull: true,
//         },
//         picture: {
//           type: DataTypes.TEXT,
//           required: false,
//           allowNull: true,
//         },
//       },
//       {
//         sequelize,
//         modelName: "Chat",
//         timestamps: true,
//         paranoid: true,
//         name: {
//           singular: "chat",
//           plural: "chats",
//         },
//       }
//     );
//   }

//   static
// }

// module.exports = Chat;

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

  const User = require("./user")(sequelize, Sequelize);
  User.hasMany(Chat, { foreignKey: "userId", sourceKey: "id" });
  Chat.belongsTo(User, { foreignKey: "userId", sourceKey: "id" });

  return Chat;
};
