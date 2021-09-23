const { isOfType } = require("../../helpers/entity-validation-utils");

class UpdateLastSeenRequest {
  constructor(props) {
    validateUserId(props.userId);
    validateChatId(props.chatId);
    validateId(props.id);

    this.userId = props.userId;
    this.chatId = props.chatId;
    this.id = props.id;
  }
}

function validateId(id) {
  if (!id) throwError("id is required");
  if (!isOfType(id, "number")) throwError("id must be a number");
}

function validateUserId(userId) {
  if (!userId) throwError("userId is required");
  if (!isOfType(userId, "string")) throwError("userId must be a string");
}

function validateChatId(chatId) {
  if (!chatId) throwError("chatId is required");
  if (!isOfType(chatId, "string")) throwError("chatId must be a string");
}

function throwError(msg) {
  throw new Error(msg);
}

module.exports = UpdateLastSeenRequest;
