const {
  isOfType,
  isSmallerThan,
  isBiggerThan,
} = require("../../helpers/entity-validation-utils");

class UpdateChatRequest {
  constructor(props) {
    validateId(props.id);
    validatePicture(props.picture);
    if (!props.isGroup) props.isGroup = false;
    if (props.isGroup) {
      validateChatGroup(props);
      this.title = props.title;
      this.description = props.description;
      this.picture = props.picture;
    }

    this.id = props.id;
    this.isGroup = props.isGroup;
  }
}

function validateId(id) {
  if (!id) throwError("id is required");
  if (!isOfType(id, "string")) throwError("id must be a string");
}

function validatePicture(picture) {
  if (!isOfType(picture, "string")) throwError("picture must be a string");
}

function validateChatGroup(props) {
  validateTitle(props.title);
  validateDescription(props.description);
}

function validateTitle(title) {
  if (!title) throwError("title is required");
  if (!isOfType(title, "string")) throwError("title must be a string");
  if (isSmallerThan(title, 3))
    throwError("title must have a minumum of 3 characters");
  if (isBiggerThan(title, 100))
    throwError("title must have a maximum of 100 characters");
}

function validateDescription(description) {
  if (!description) throwError("description is required");
  if (!isOfType(description, "string"))
    throwError("description must be a string");
  if (isSmallerThan(description, 3))
    throwError("description must have a minumum of 3 characters");
  if (isBiggerThan(description, 255))
    throwError("description must have a maximum of 255 characters");
}

function throwError(msg) {
  throw new Error(msg);
}

module.exports = UpdateChatRequest;
