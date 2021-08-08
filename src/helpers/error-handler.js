const createHttpError = require("http-errors");

module.exports = function (statusCode, err, customHeaders) {
  return {
    statusCode,
    error: new createHttpError(statusCode, err, customHeaders),
  };
};
