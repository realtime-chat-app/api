const db = require("../../models");

const promisesHelper = require("../../helpers/promises");
const passwordHelper = require("../../helpers/password");

async function CreateUser(user) {
  const hashedPass = passwordHelper.HashPassword(user.password);

  return await db.User.findOrCreate({
    where: { email: user.email },
    defaults: {
      name: user.name,
      email: user.email,
      password: hashedPass.hashedPassword,
      salt: hashedPass.salt,
    },
  });
}

async function UpdateUser(user) {
  const updatedUser = {
    ...(user.name && { name: user.name }),
    ...(user.password && { password: user.password }),
    // ...user.email && { email: user.email },
    // ...user.deletedAt && { deletedAt: new Date().toISOString() },
    // ...user.createdAt && { createdAt: +user.createdAt },
    // ...user.updatedAt && { updatedAt: +user.updatedAt },
  };
  const res = await db.User.findOne({ where: { id: user.id } });
  const currStoredUser = res.dataValues;

  if (updatedUser.password) {
    const newPassHashedWithOldSalt = passwordHelper.HashPassword(
      user.password,
      currStoredUser.salt
    );
    const oldPassword = currStoredUser.password;

    // Check if new password is same as current password. If true, return custom error message
    if (newPassHashedWithOldSalt.hashedPassword === oldPassword) {
      return promisesHelper.RejectErrorMessage(
        "New password cant be same as current"
      );
    }

    const hashedPass = passwordHelper.HashPassword(user.password);
    updatedUser.salt = hashedPass.salt;
    updatedUser.password = hashedPass.hashedPassword;
  }

  return await db.User.update(updatedUser, { where: { id: user.id } });
}

async function FindUserByEmail(email) {
  return await db.User.findOne({
    where: { email: email },
  });
}

async function FindAllUsers() {
  return await db.User.findAll();
}

async function DeleteUserById(id) {
  return await db.User.destroy({
    where: { id },
  });
}

module.exports = {
  CreateUser,
  FindUserByEmail,
  UpdateUser,
  FindAllUsers,
  DeleteUserById,
};
