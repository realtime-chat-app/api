const passport = require("passport");
const httpError = require("../error/http-error");

module.exports = function (req, res, next, cb) {
  if (
    !req.headers?.authorization ||
    !req.headers.authorization.includes("Bearer ")
  ) {
    return next(httpError(401, "Missing 'Authorization' header"));
  }

  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (info) {
      if (info.name == "TokenExpiredError") {
        return next(httpError(401, "JWT is expired"));
      }
      return next(info);
    }
    if (err) return next(err);

    return cb(user);
  })(req, res, next);
};
