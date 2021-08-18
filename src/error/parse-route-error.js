const httpError = require("./http-error");

module.exports = function (error) {
  // If error is a string, then it is a custom error message
  if (typeof error == "string") return httpError(400, error);

  return httpError(500, error);
};
