const {
  isArray,
  isOfType,
  isSmallerThan,
  isBiggerThan,
  arrayEntriesAreOfType,
} = require("../../helpers/entity-validation-utils");

class CreateChatRequest {
  constructor(props) {
    validateUserId(props.userId);
    validateMembers(props.members);
    validatePicture(props.picture);
    if (!props.isGroup) props.isGroup = false;
    if (props.isGroup) {
      validateChatGroup(props);
      this.title = props.title;
      this.description = props.description;
      this.picture = props.picture;
    }

    this.isGroup = props.isGroup;
    this.members = props.members;
    this.userId = props.userId;
  }
}

function validateUserId(userId) {
  if (!userId) throwError("userId is required");
  if (!isOfType(userId, "string")) throwError("userId must be a string");
}

function validateMembers(members) {
  if (!members) throwError("members is required");
  if (!isArray(members)) throwError("members must be an array of user id");
  if (!arrayEntriesAreOfType(members, "string"))
    throwError("members must be an array of user id");
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

module.exports = CreateChatRequest;
