const httpError = require("../error/http-error");

function error404Handler(req, res) {
  const error = httpError(404, "Route not found");
  res.status(404).send(error);
}

function globalRouteErrorHandler(error, req, res, next) {
  const defaultInternalError = httpError(500, "Internal server error");

  if (!error?.statusCode || error?.statusCode === 500) {
    res.status(500).send(defaultInternalError);
    console.log(`\n`);
    console.error("\x1b[31m", error);
    console.log(`\n`);
  } else {
    res.status(error.statusCode).send(error);
    console.log(`\n`);
    console.error("\x1b[33m", error);
    console.log(`\n`);
  }
}

module.exports = {
  error404Handler,
  globalRouteErrorHandler,
};
