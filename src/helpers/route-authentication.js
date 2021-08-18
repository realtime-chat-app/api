const passport = require("passport");
const createHttpError = require("./error-handler");

module.exports = function (req, res, next, cb) {
  if (
    !req.headers?.authorization ||
    !req.headers.authorization.includes("Bearer ")
  ) {
    return next(createHttpError(401, "Missing 'Authorization' header"));
  }

  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (info) {
      if (info.name == "TokenExpiredError") {
        return next(createHttpError(401, "JWT is expired"));
      }
      return next(info);
    }
    if (err) return next(err);

    return cb();
  })(req, res, next);
};
