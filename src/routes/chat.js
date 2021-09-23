const router = require("express").Router();

const chatService = require("../services/chat");

const authenticate = require("../helpers/route-authentication");

const parseRouteError = require("../error/parse-route-error");
const httpError = require("../error/http-error");

const {
  AddChatMemberRequestEntity,
  DeleteChatMemberRequestEntity,
  CreateChatRequestEntity,
  UpdateChatRequestEntity,
} = require("../entities/chat");

router.get("/", (req, res, next) => {
  authenticate(req, res, next, () => {
    chatService
      .FindAllChats()
      .then((chats) => res.status(200).json(chats))
      .catch((error) => next(parseRouteError(error)));
  });
});

router.get("/:id", (req, res, next) => {
  authenticate(req, res, next, () => {
    chatService
      .FindChatById(req.params.id)
      .then((chats) => res.status(200).json(chats))
      .catch((error) => next(parseRouteError(error)));
  });
});

router.get("/user/:id", (req, res, next) => {
  authenticate(req, res, next, () => {
    chatService
      .FindAllChatsByUserId(req.params.id)
      .then((chats) => res.status(200).json(chats))
      .catch((error) => next(parseRouteError(error)));
  });
});

router.post("/", (req, res, next) => {
  let chat = null;

  try {
    chat = new CreateChatRequestEntity({ ...req.body });
  } catch (error) {
    return next(httpError(400, error.message));
  }

  authenticate(req, res, next, () => {
    chatService
      .CreateChat(chat)
      .then((svcRes) =>
        svcRes ? res.status(200).json(svcRes) : next(httpError(400, svcRes))
      )
      .catch((error) => next(parseRouteError(error)));
  });
});

router.post("/:id/members", (req, res, next) => {
  if (!req.body.members.length || typeof req.body.members !== "object")
    return next("members is required and should be an array of user id's");

  let members = null;

  try {
    members = req.body.members.map(
      (userId) =>
        new AddChatMemberRequestEntity({
          userId,
          chatId: req.params.id,
        })
    );
  } catch (error) {
    return next(httpError(400, error.message));
  }

  authenticate(req, res, next, () => {
    chatService
      .BulkCreateMembers(members)
      .then((svcRes) =>
        svcRes ? res.status(200).json(svcRes) : next(httpError(400, svcRes))
      )
      .catch((error) => next(parseRouteError(error)));
  });
});

router.delete("/:id/members", (req, res, next) => {
  if (!req.body.members.length || typeof req.body.members !== "object")
    return next("members is required and should be an array of user ids");

  let members = null;

  try {
    members = new DeleteChatMemberRequestEntity(req.body.members).ids;
  } catch (error) {
    return next(httpError(400, error.message));
  }

  authenticate(req, res, next, () => {
    chatService
      .BulkDeleteMembers(members)
      .then((svcRes) =>
        svcRes > 0
          ? res.status(200).json(svcRes)
          : next(httpError(400, "No member were deleted"))
      )
      .catch((error) => next(parseRouteError(error)));
  });
});

router.put("/", (req, res, next) => {
  let chat = null;

  try {
    chat = new UpdateChatRequestEntity({
      ...req.body,
    });
  } catch (error) {
    return next(httpError(400, error.message));
  }

  authenticate(req, res, next, () => {
    chatService
      .UpdateChat(chat)
      .then((svcRes) =>
        svcRes ? res.status(200).json(svcRes[0]) : next(httpError(400, svcRes))
      )
      .catch((error) => next(parseRouteError(error)));
  });
});

router.delete("/:id", (req, res, next) => {
  authenticate(req, res, next, () => {
    chatService
      .DeleteChatById(req.params.id)
      .then((svcRes) =>
        svcRes > 0
          ? res.status(200).json(svcRes)
          : next(httpError(400, "Chat was not deleted"))
      )
      .catch((error) => next(parseRouteError(error)));
  });
});

module.exports = router;
