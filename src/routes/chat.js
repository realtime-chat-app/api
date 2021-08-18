const router = require("express").Router();
const validate = require("validate.js");

const Chat = require("../services/chat");

const passportAuthenticationHandler = require("../helpers/route-authentication");
const createHttpError = require("../helpers/error-handler");
const promisesHelper = require("../helpers/promises");

// TODO: Add route to include/exlcude member from chat
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
  const chat = { ...req.body };
  const constraints = {
    title: {
      presence: chat.isGroup ? true : false,
      length: {
        minimum: 1,
        maximum: 255,
        message: "Name must be a minimum of 1 characters and maximum 255",
      },
    },
    description: {
      presence: chat.isGroup ? true : false,
      length: {
        minimum: 1,
        maximum: 255,
        message:
          "Description must be a minimum of 1 characters and maximum 255",
      },
    },
    members: (value, attributes, attributeName, options, constraints) => {
      if (!value.length || value.length === 0)
        return {
          presence: true,
          isArray: {
            message: "Members must be an array",
          },
          length: {
            minimum: 1,
            maximum: 100,
            message:
              "Members must be an array with a minimum of 1 entry and maximum 100",
          },
        };

      if (!value.every((v) => v.userId))
        return {
          presence: true,
          length: {
            minimum: value.length + 1,
            maximum: value.length + 2,
            message: "^userId is required for members",
          },
        };
    },
  };

  const validation = validate(chat, constraints);
  if (validation) return next(createHttpError(400, validation));

  passportAuthenticationHandler(req, res, next, () => {
    Chat.CreateChat(chat)
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
  const chat = { ...req.body };
  const constraints = {
    id: {
      presence: true,
    },
    title: {
      length: {
        minimum: 1,
        maximum: 255,
        message: "Name must be a minimum of 1 characters and maximum 255",
      },
    },
    description: {
      length: {
        minimum: 1,
        maximum: 255,
        message:
          "Description must be a minimum of 1 characters and maximum 255",
      },
    },
  };

  const validation = validate(chat, constraints);
  if (validation) return next(createHttpError(400, validation));

  passportAuthenticationHandler(req, res, next, () => {
    Chat.UpdateChat(chat)
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

// TODO: add delete route

module.exports = router;
