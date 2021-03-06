const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");

const userService = require("../services/user");

const passwordHelper = require("../helpers/password");

const httpError = require("../error/http-error");

//JWT Strategy for token and session validation
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_SESSION_KEY;

passport.use(
  new JwtStrategy(opts, (payload, done) => {
    //Find the user in db if needed
    userService
      .FindUserByEmail(payload.email)
      .then((user) => {
        if (user) {
          if (!passwordHelper.UserPasswordIsValid(user, payload.password)) {
            return done(null, null, httpError(401, "Invalid password"));
          } else {
            return done(null, user);
          }
        } else {
          return done(null, null, httpError(401, "User not found"));
        }
      })
      .catch((err) => {
        return done(httpError(500, err), null, null);
      });
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  userService
    .FindUserById(user.id)
    .then((foundUser) => done(null, foundUser.dataValues))
    .catch((err) => done(err));
});
