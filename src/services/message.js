const db = require("../models");

const clientError = require("../error/client-error");

async function CreateMessage(messageProps) {
  const { Message } = db.sequelize.models;

  return await Message.create({ ...messageProps });
}

async function UpdateMessage(message) {
  const updatedMessage = {
    ...(message.text && { text: message.text }),
    ...(message.type && { type: message.type }),
    ...(message.reply && { reply: message.reply }),
    ...(message.latitude && { latitude: message.latitude }),
    ...(message.longitude && { longitude: message.longitude }),
    ...(message.quote && { quote: message.quote }),
  };

  return await db.Message.update(updatedMessage, { where: { id: message.id } });
}

async function FindMessageById(id) {
  if (!id || typeof id !== "string")
    return clientError("id must be specified and should be a string");

  const { Message } = db.sequelize.models;
  return await Message.findOne({
    where: {
      id,
    },
  });
}

async function FindAllMessages() {
  const { Message } = db.sequelize.models;
  return await Message.findAll({});
}

async function FindAllMessagesBySenderId(senderId) {
  if (!senderId || typeof senderId !== "string")
    return clientError("senderId must be specified and should be a string");

  const { Message } = db.sequelize.models;
  return await Message.findAll({
    where: {
      senderId,
    },
  });
}

async function FindMessageByChatId(chatId) {
  if (!chatId || typeof chatId !== "string")
    return clientError("chatId must be specified and should be a string");

  const { Message } = db.sequelize.models;
  return await Message.findAll({
    where: {
      chatId,
    },
  });
}

async function DeleteMessageById(id) {
  return await db.sequelize.models.Message.destroy({
    where: { id },
  });
}

module.exports = {
  CreateMessage,
  UpdateMessage,
  FindAllMessages,
  DeleteMessageById,
  FindAllMessagesBySenderId,
  FindMessageById,
  FindMessageByChatId,
};
