const db = require("../models");

const clientError = require("../error/client-error");

async function CreateChat(chatProps) {
  const { Chat } = db.sequelize.models;

  const chat = await Chat.create({ ...chatProps });

  const membersWithChatId = chatProps.members.map((userId) => ({
    userId,
    chatId: chat.id,
  }));
  membersWithChatId.push({ userId: chatProps.userId, chatId: chat.id });
  const members = await BulkCreateMembers(membersWithChatId);

  return { ...chat.dataValues, members };
}

async function BulkCreateMembers(members) {
  const { Member } = db.sequelize.models;

  return getDataValuesFromBulkCreate(
    await Member.bulkCreate(members, {
      returning: true,
    })
  );
}

async function BulkDeleteMembers(members) {
  const { Member } = db.sequelize.models;

  return await Member.destroy({ where: { id: members } });
}

async function UpdateChat(chat) {
  const updatedChat = {
    ...(chat.title && { title: chat.title }),
    ...(chat.description && { description: chat.description }),
    ...(chat.picture && { picture: chat.picture }),
  };

  return await db.Chat.update(updatedChat, { where: { id: chat.id } });
}

async function FindAllChats() {
  const { Chat } = db.sequelize.models;
  return await Chat.findAll({});
}

async function FindAllChatsByUserId(userId) {
  if (!userId || typeof userId !== "string")
    return clientError("userId must be specified and should be a string");

  const { Chat, Member, User, LastSeen } = db.sequelize.models;
  return await Chat.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: Member,
        attributes: ["id", "createdAt"],
        include: {
          model: User,
          attributes: ["name", "email", "id"],
        },
      },
      {
        model: LastSeen,
        attributes: ["id", "createdAt", "updatedAt", "chatId", "userId"],
        limit: 1,
      },
    ],
  });
}

async function FindChatById(id) {
  if (!id || typeof id !== "string")
    return clientError("id must be specified and should be a string");

  const { Chat, Member, User, LastSeen } = db.sequelize.models;
  return await Chat.findOne({
    where: {
      id,
    },
    include: [
      {
        model: Member,
        attributes: ["id", "createdAt"],
        include: {
          model: User,
          attributes: ["name", "email", "id"],
        },
      },
      {
        model: LastSeen,
        attributes: ["id", "createdAt", "updatedAt", "chatId", "userId"],
        limit: 1,
      },
    ],
  });
}

async function FindChatByIdIncludingMembers(chatId) {
  if (!chatId || typeof chatId !== "string")
    return clientError("chatId must be specified and should be a string");

  const { Chat, Member, User, Message } = db.sequelize.models;
  return await Member.findAll({
    where: { chatId },
  })
    .then((res) => res.map((v) => v.dataValues))
    .then((res) => res.map((v) => v.chatId))
    .then((ids) =>
      Chat.findOne({
        where: { id: ids },
        attributes: [
          "id",
          "isGroup",
          "title",
          "description",
          "picture",
          "createdAt",
          "updatedAt",
          "userId",
          "isGroup",
        ],
        include: [
          {
            model: Member,
            attributes: ["id", "createdAt", "userId"],
            include: {
              model: User,
              attributes: ["name"],
            },
          },
          {
            model: Message,
            attributes: [
              "id",
              "latitude",
              "longitude",
              "reply",
              "type",
              "text",
              "quote",
              "createdAt",
              "updatedAt",
              "senderId",
            ],
            limit: 1000,
            order: [["createdAt", "DESC"]],
            include: {
              model: User,
              attributes: ["name"],
            },
          },
          {
            model: LastSeen,
            attributes: ["id", "createdAt", "updatedAt", "chatId", "userId"],
            limit: 1,
          },
        ],
      })
    )
    .then((res) => parseChatWithMembers(res));
}

async function FindUserChatsWithMembers(userId) {
  if (!userId || typeof userId !== "string")
    return clientError("userId must be specified and should be a string");

  const { Chat, Member, User, Message, LastSeen } = db.sequelize.models;
  return await Member.findAll({
    where: { userId },
  })
    .then((res) => res.map((v) => v.dataValues))
    .then((res) => res.map((v) => v.chatId))
    .then((ids) =>
      Chat.findAll({
        where: { id: ids },
        attributes: [
          "id",
          "isGroup",
          "title",
          "description",
          "picture",
          "createdAt",
          "updatedAt",
          "userId",
          "isGroup",
        ],
        include: [
          {
            model: Member,
            attributes: ["id", "createdAt", "userId"],
            include: {
              model: User,
              attributes: ["name"],
            },
          },
          {
            model: Message,
            attributes: [
              "id",
              "latitude",
              "longitude",
              "reply",
              "type",
              "text",
              "quote",
              "createdAt",
              "updatedAt",
              "senderId",
            ],
            limit: 1000,
            order: [["createdAt", "DESC"]],
            include: {
              model: User,
              attributes: ["name"],
            },
          },
          {
            model: LastSeen,
            attributes: ["id", "createdAt", "updatedAt", "chatId", "userId"],
            limit: 1,
          },
        ],
      })
    )
    .then((res) => parseChatWithMembers(res));
}

async function FindAllChatMembers(chatId) {
  if (!chatId || typeof chatId !== "string")
    return clientError("chatId must be specified and should be a string");

  const { Member, User } = db.sequelize.models;

  return await Member.findAll({
    where: { chatId },
    include: { model: User, attributes: ["name", "email"] },
  });
}

async function DeleteChatById(id) {
  return await db.sequelize.models.Chat.destroy({
    where: { id },
  });
}

function parseChatWithMembers(payload) {
  if (payload && payload.length) {
    return payload
      .map((chat) => chat.dataValues)
      .map((chat) => {
        removeNullValuesFromObject(chat);
        if (chat.lastSeen && chat.lastSeen.length) {
          chat.lastSeen = chat.lastSeen.map((l) => l.dataValues);
          chat.lastSeen = chat.lastSeen[0];
        }
        if (chat.lastSeen && !chat.lastSeen.id) {
          delete chat.lastSeen;
        }

        chat.members = chat.members
          .map((m) => m.dataValues)
          .map((m) => removeNullValuesFromObject(m));
        chat.messages = chat.messages
          ?.map((m) => m.dataValues)
          .map((m) => removeNullValuesFromObject(m));
        return chat;
      });
  } else if (typeof payload === "object") {
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
  CreateChat,
  UpdateChat,
  FindAllChats,
  DeleteChatById,
  FindAllChatsByUserId,
  FindChatById,
  BulkCreateMembers,
  BulkDeleteMembers,
  FindAllChatMembers,
  FindChatByIdIncludingMembers,
  FindUserChatsWithMembers,
};

function getDataValuesFromBulkCreate(bulkCreateResponse) {
  return bulkCreateResponse.map((m) => m.dataValues);
}
