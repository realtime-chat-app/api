const { isOfType } = require("../../helpers/entity-validation-utils");

class AddChatMemberRequest {
  constructor(props) {
    validateUserId(props.userId);
    validateChatId(props.chatId);

    this.userId = props.userId;
    this.chatId = props.chatId;
  }
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

module.exports = AddChatMemberRequest;
