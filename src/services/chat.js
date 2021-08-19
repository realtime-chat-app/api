const db = require("../models");

const clientError = require("../error/client-error");

async function CreateChat(chatProps) {
  const { Chat } = db.sequelize.models;

  const chat = await Chat.create({ ...chatProps });

  const membersWithChatId = members.map((m) => ({
    userId: m.userId,
    chatId,
  }));
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

  const { Chat, Member, User } = db.sequelize.models;
  return await Chat.findAll({
    where: {
      userId,
    },
    include: {
      model: Member,
      attributes: ["id", "createdAt"],
      include: {
        model: User,
        attributes: ["name", "email", "id"],
      },
    },
  });
}

async function FindChatById(id) {
  if (!id || typeof id !== "string")
    return clientError("id must be specified and should be a string");

  const { Chat, Member, User } = db.sequelize.models;
  return await Chat.findOne({
    where: {
      id,
    },
    include: {
      model: Member,
      attributes: ["id", "createdAt"],
      include: {
        model: User,
        attributes: ["name", "email", "id"],
      },
    },
  });
}

async function DeleteChatById(id) {
  return await db.sequelize.models.Chat.destroy({
    where: { id },
  });
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
};

function getDataValuesFromBulkCreate(bulkCreateResponse) {
  return bulkCreateResponse.map((m) => m.dataValues);
}
