const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const { User } = require("../entities/user");

const port = process.env.SOCKET_PORT || 1080;
const ws = new Server(port, {
  path: "/",
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
  cors: {
    origins: ["*"],
  },
});

ws.on("connection", (socket) => {
  try {
    const user = new User(JSON.parse(socket.handshake.query.user));
    const token = user.token.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET_SESSION_KEY);
  } catch (error) {
    socket.disconnect();
  }
});

module.exports = ws;
