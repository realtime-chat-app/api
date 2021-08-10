const db = require("../models");

const promisesHelper = require("../helpers/promises");

async function CreateChat(chatProps) {
  const { Chat, Member } = db;

  const chat = await Chat.create({ ...chatProps });

  const membersWithChatId = chatProps.members.map((m) => ({
    ...m,
    chatId: chat.id,
  }));
  const members = getDataValuesFromBulkCreate(
    await Member.bulkCreate([...membersWithChatId], {
      returning: true,
    })
  );

  return { ...chat.dataValues, members };
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
  const { Chat, Member, User } = db;
  return await Chat.findAll({
    // include: {
    //   model: Member,
    //   attributes: ["id", "createdAt"],
    //   include: {
    //     model: User,
    //     attributes: ["name", "email", "id"],
    //   },
    // },
  });
}

async function DeleteChatById(id) {
  return await db.Chat.destroy({
    where: { id },
  });
}

module.exports = {
  CreateChat,
  UpdateChat,
  FindAllChats,
  DeleteChatById,
};

function getDataValuesFromBulkCreate(bulkCreateResponse) {
  return bulkCreateResponse.map((m) => m.dataValues);
}
