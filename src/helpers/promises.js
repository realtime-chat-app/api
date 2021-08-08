const createHttpError = require("./error-handler");

function RejectErrorMessage(message) {
  return new Promise((res, rej) => rej(message));
}

function HandlePromiseRejection(error) {
  // If response is a string, then it is a custom error message
  if (typeof error == "string") return createHttpError(400, error);

  return createHttpError(500, error);
}

module.exports = {
  RejectErrorMessage,
  HandlePromiseRejection,
};
