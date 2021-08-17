const router = require("express").Router();
const validate = require("validate.js");
const passport = require("passport");

const Chat = require("../services/chat");

const passportAuthenticationHandler = require("../helpers/route-authentication");
const createHttpError = require("../helpers/error-handler");
const promisesHelper = require("../helpers/promises");

// TODO: add constraints
router.get("/", (req, res, next) => {
  passportAuthenticationHandler(req, res, next, () => {
    Chat.FindAllChats()
      .then((chats) => {
        res.status(200).json(chats);
      })
      .catch((error) => next(promisesHelper.HandlePromiseRejection(error)));
  });
});

router.get("/:id", (req, res, next) => {
  passportAuthenticationHandler(req, res, next, () => {
    Chat.FindChatById(req.params.id)
      .then((chats) => {
        res.status(200).json(chats);
      })
      .catch((error) => next(promisesHelper.HandlePromiseRejection(error)));
  });
});

router.get("/user/:id", (req, res, next) => {
  passportAuthenticationHandler(req, res, next, () => {
    Chat.FindAllChatsByUserId(req.params.id)
      .then((chats) => {
        res.status(200).json(chats);
      })
      .catch((error) => next(promisesHelper.HandlePromiseRejection(error)));
  });
});

router.post("/", (req, res, next) => {
  passportAuthenticationHandler(req, res, next, () => {
    Chat.CreateChat({ ...req.body, userId: user.id })
      .then((response) => {
        if (!response) return next(createHttpError(400, response));
        else {
          return res.status(200).json(response);
        }
      })
      .catch((error) => next(promisesHelper.HandlePromiseRejection(error)));
  });
});

router.put("/", (req, res, next) => {
  passportAuthenticationHandler(req, res, next, () => {
    Chat.UpdateChat({ ...req.body })
      .then((response) => {
        if (!response || !response.length)
          return next(createHttpError(400, response));
        else {
          return res.status(200).json(response[0]);
        }
      })
      .catch((error) => next(promisesHelper.HandlePromiseRejection(error)));
  });
});

module.exports = router;
