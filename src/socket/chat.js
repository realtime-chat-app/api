const ws = require("../config/socket.io").getSocketInstance();
const jwt = require("jsonwebtoken");

const {
  FindChatByIdIncludingMembers,
  FindUserChatsWithMembers,
  FindAllChatMembers,
  CreateChat,
} = require("../services/chat");
const { CreateMessage } = require("../services/message");

const { User: UserEntity } = require("../entities/user");
const {
  CreateChatRequestEntity: CreateChatEntity,
} = require("../entities/chat");

ws.on("connection", (socket) =>
  authenticateNewSocket(socket)
    .then(() => parseUser(socket))
    .then((user) => getUserChats(user))
    .then((chats) => joinRooms(chats, socket))
    .then(setupListeners(socket))
    .then((chats) => socket.emit("chats", chats))
    .catch((error) => {
      console.error(error);
      socket.disconnect();
    })
);

function setupListeners(socket) {
  socket.on("message", async (payload) => {
    try {
      const createdMessage = await CreateMessage(payload);
      ws.to(createdMessage.dataValues.chatId).emit("new-message", payload);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("chat:start-chat", (chat) => {
    try {
      const _chat = new CreateChatEntity({ ...chat });
      CreateChat(_chat)
        .then((res) => FindChatByIdIncludingMembers(res.id))
        .then((res) => {
          // search for members socket instances and join room with found instances
          ws.fetchSockets().then((sockets) => {
            findConnectedMembersSockets(sockets, res.members).map(
              (currFoundSocket) => {
                currFoundSocket.join(res.id);
              }
            );
            socket.join(res.id);
            ws.to(res.id).emit("chat:new-chat", res);
          });
        });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("chat:get-members", (chat) => {
    FindAllChatMembers(chat.id)
      .then((members) => members.map((v) => v.dataValues))
      .then((members) => socket.emit("chat-members", members));
  });

  socket.on("disconnect", () => onDisconnect(socket));
}

function findConnectedMembersSockets(sockets, members) {
  return sockets
    .map((socket) => {
      const user = parseUser(socket);
      return members.find((m) => m.userId === user.id) ? socket : null;
    })
    .filter((socket) => socket !== null && socket !== undefined);
}

function joinRooms(chats, socket) {
  const ids = chats.map((x) => x.id);
  socket.join(ids);
  return chats;
}

function parseUser(socket) {
  const userJSON = socket.handshake.query.user;
  const user = new UserEntity(JSON.parse(userJSON));
  return user;
}

function getUserChats(user) {
  return FindUserChatsWithMembers(user.id);
}

function setupNestedRoomsEmission(chatIds) {
  return chatIds.reduce((acc, curr, idx, src) => {
    return acc.to(curr);
  }, ws.to(chatIds[0]));
}

async function authenticateNewSocket(socket) {
  try {
    const user = new UserEntity(JSON.parse(socket.handshake.query.user));
    const token = user.token.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET_SESSION_KEY);
  } catch (error) {}
}

function onDisconnect(socket) {
  // disconnect logic goes here
}
