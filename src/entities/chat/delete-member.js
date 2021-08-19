const {
  isArray,
  arrayEntriesAreOfType,
} = require("../../helpers/entity-validation-utils");

class DeleteChatMemberRequest {
  constructor(ids) {
    validateIds(ids);
    this.ids = ids;
  }
}

function validateIds(ids) {
  if (!isArray(ids)) throwError("must specify an array of member id");
  if (
    !arrayEntriesAreOfType(ids, "string") &&
    !arrayEntriesAreOfType(ids, "number")
  )
    throwError("ids must be number or string");
}

function throwError(msg) {
  throw new Error(msg);
}

module.exports = DeleteChatMemberRequest;
