const db = require("../models");

const clientError = require("../error/client-error");

async function CreateLastSeen(lastSeenProps) {
  const { userId, chatId } = lastSeenProps;
  if (!userId || typeof userId !== "string")
    return clientError("userId must be specified and should be a string");
  if (!chatId || typeof userId !== "string")
    return clientError("userId must be specified and should be a string");

  const { LastSeen } = db.sequelize.models;
  return await LastSeen.findOrCreate({
    where: {
      chatId: lastSeenProps.chatId,
      userId: lastSeenProps.userId,
    },
    defaults: { ...lastSeenProps },
  }).then(([lastSeen, created]) => {
    if (created) {
      return parseLastSeen(lastSeen);
    } else {
      return UpdateLastSeen(lastSeen.dataValues);
    }
  });
}

async function UpdateLastSeen(lastSeen) {
  const { LastSeen } = db.sequelize.models;
  const { userId, chatId } = lastSeen;

  if (!userId || typeof userId !== "string")
    return clientError("userId must be specified and should be a string");
  if (!chatId || typeof chatId !== "string")
    return clientError("chatId must be specified and should be a string");

  // TODO: find a way to do this action with a single request
  return await LastSeen.findOne({
    where: {
      chatId: lastSeen.chatId,
      userId: lastSeen.userId,
    },
  })
    .then((foundLastSeen) => {
      foundLastSeen.changed("updatedAt", true);
      return foundLastSeen.save();
    })
    .then((v) => v.dataValues);
}

function parseLastSeen(payload) {
  if (payload && typeof payload === "object") {
    payload = payload.dataValues;
    if (payload.length && payload.length === 0) return null;
    return removeNullValuesFromObject(payload);
  }

  return null;
}

function removeNullValuesFromObject(object) {
  Object.keys(object).forEach(
    (k) => !object[k] && object[k] !== undefined && delete object[k]
  );
  return object;
}

module.exports = {
  CreateLastSeen,
  UpdateLastSeen,
};
