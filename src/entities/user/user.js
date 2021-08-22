const {
  isOfType,
  isSmallerThan,
  isBiggerThan,
} = require("../../helpers/entity-validation-utils");

class User {
  constructor(props) {
    validateName(props.name);
    validateEmail(props.email);
    validatePassword(props.password);

    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.token = props.token;
    this.salt = props.salt;
  }
}

function validateName(name) {
  if (!name) throwError("Name is required");
  if (!isOfType(name, "string")) throwError("Name must be a string");
  if (isSmallerThan(name, 3))
    throwError("Name must be a minimum of 3 characters");
  if (isBiggerThan(name, 20))
    throwError("Name must be a maximum of 20 characters");
}

function validatePassword(password) {
  if (!password) throwError("Password is required");
  if (!isOfType(password, "string")) throwError("Password must be a string");
}

function validateEmail(email) {
  if (!email) throwError("Email is required");
  if (!isOfType(email, "string")) throwError("Email must be a string");
  if (!emailIsValid(email)) throwError("Email is invalid");
}

function emailIsValid(input) {
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (input.match(validRegex)) return true;
  else return false;
}

function throwError(msg) {
  throw new Error(msg);
}

module.exports = User;
