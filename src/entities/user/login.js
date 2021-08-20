const {
  isOfType,
  isSmallerThan,
  isBiggerThan,
} = require("../../helpers/entity-validation-utils");

class LoginUserRequest {
  constructor(props) {
    validateEmail(props.email);
    validatePassword(props.password);

    this.email = props.email;
    this.password = props.password;
  }
}

function validatePassword(password) {
  if (!password) throwError("Password is required");
  if (!isOfType(password, "string")) throwError("Password must be a string");
  if (isSmallerThan(password, 5))
    throwError("Password must be a minimum of 5 characters");
  if (isBiggerThan(password, 30))
    throwError("Password must be a maximum of 30 characters");
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

module.exports = LoginUserRequest;
