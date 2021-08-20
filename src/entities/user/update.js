const {
  isOfType,
  isSmallerThan,
  isBiggerThan,
} = require("../../helpers/entity-validation-utils");

class UpdateUserRequest {
  constructor(props) {
    validateId(props.id);
    this.id = props.id;

    if (props.name) {
      validateName(props.name);
      this.name = props.name;
    }
    if (props.email) {
      validateEmail(props.email);
      this.email = props.email;
    }
    if (props.password) {
      validatePassword(props.password);
      this.password = props.password;
    }
  }
}

function validateId(id) {
  if (!id) throwError("ID is required");
  if (!isOfType(id, "string")) throwError("ID must be a string");
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

module.exports = UpdateUserRequest;
