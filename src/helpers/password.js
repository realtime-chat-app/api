const crypto = require("crypto");

function HashPassword(password, currSalt) {
  // Creating a unique salt for a particular user
  const salt = currSalt || crypto.randomBytes(16).toString("hex");

  // Hashing user's salt and password with 1000 iterations,
  // 64 length and md5 digest
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `md5`)
    .toString(`hex`);

  return { salt, hashedPassword };
}

function UserPasswordIsValid(currentUser, plainTextPassword) {
  const hasedPassword = HashPassword(
    plainTextPassword,
    currentUser.salt
  ).hashedPassword;

  return hasedPassword === currentUser.password;
}

module.exports = {
  UserPasswordIsValid,
  HashPassword,
};
