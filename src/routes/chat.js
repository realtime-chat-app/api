const router = require("express").Router();
const validate = require("validate.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const Chat = require("../services/chat");

const createHttpError = require("../helpers/error-handler");
const promisesHelper = require("../helpers/promises");

// TODO: add constraints
router.get("/", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (info) return next(info);
    if (err) return next(err);

    Chat.FindAllChats()
      .then((chats) => {
        res.status(200).json(chats);
      })
      .catch((error) => next(promisesHelper.HandlePromiseRejection(error)));
  })(req, res, next);
});

router.post("/", (req, res, next) => {
  if (
    !req.headers?.authorization ||
    !req.headers.authorization.includes("Bearer ")
  ) {
    return next(createHttpError(401, "Missing 'Authorization' header"));
  }

  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (info) return next(info);
    if (err) return next(err);

    Chat.CreateChat({ ...req.body, userId: user.id })
      .then((response) => {
        if (!response) return next(createHttpError(400, response));
        else {
          return res.status(200).json(response);
        }
      })
      .catch((error) => next(promisesHelper.HandlePromiseRejection(error)));
  })(req, res, next);
});

router.put("/", (req, res, next) => {
  if (
    !req.headers?.authorization ||
    !req.headers.authorization.includes("Bearer ")
  ) {
    return next(createHttpError(401, "Missing 'Authorization' header"));
  }

  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (info) return next(info);
    if (err) return next(err);

    Chat.UpdateChat({ ...req.body })
      .then((response) => {
        if (!response || !response.length)
          return next(createHttpError(400, response));
        else {
          return res.status(200).json(response[0]);
        }
      })
      .catch((error) => next(promisesHelper.HandlePromiseRejection(error)));
  })(req, res, next);
});

module.exports = router;
