const router = require("express").Router();
const validate = require("validate.js");

const chatService = require("../services/chat");

const authenticate = require("../helpers/route-authentication");

const parseRouteError = require("../error/parse-route-error");
const httpError = require("../error/http-error");

// TODO: Add route to include/exlcude member from chat
router.get("/", (req, res, next) => {
  authenticate(req, res, next, () => {
    chatService
      .FindAllChats()
      .then((chats) => {
        res.status(200).json(chats);
      })
      .catch((error) => next(parseRouteError(error)));
  });
});

router.get("/:id", (req, res, next) => {
  authenticate(req, res, next, () => {
    chatService
      .FindChatById(req.params.id)
      .then((chats) => {
        res.status(200).json(chats);
      })
      .catch((error) => next(parseRouteError(error)));
  });
});

router.get("/user/:id", (req, res, next) => {
  authenticate(req, res, next, () => {
    chatService
      .FindAllChatsByUserId(req.params.id)
      .then((chats) => {
        res.status(200).json(chats);
      })
      .catch((error) => next(parseRouteError(error)));
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
  if (validation) return next(httpError(400, validation));

  authenticate(req, res, next, () => {
    chatService
      .CreateChat(chat)
      .then((response) => {
        if (!response) return next(httpError(400, response));
        else {
          return res.status(200).json(response);
        }
      })
      .catch((error) => next(parseRouteError(error)));
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
  if (validation) return next(httpError(400, validation));

  authenticate(req, res, next, () => {
    chatService
      .UpdateChat(chat)
      .then((response) => {
        if (!response || !response.length)
          return next(httpError(400, response));
        else {
          return res.status(200).json(response[0]);
        }
      })
      .catch((error) => next(parseRouteError(error)));
  });
});

// TODO: add delete route

module.exports = router;
