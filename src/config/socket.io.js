const { Server } = require("socket.io");
const { Server: HttpServer } = require("http");

let ws;

/**
 * Initialize Socket instance
 * @param {HttpServer} http - The HTTP server instance to be used in WebSocket
 * @returns {Server}
 */
function initSocket(http) {
  ws = new Server(http, {
    path: "/ws",
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
    cors: {
      origins: ["*"],
    },
  });
  return ws;
}

/**
 * Returns the SocketIo instance
 * @returns {Server}
 */
function getSocketInstance() {
  return ws;
}

module.exports = {
  initSocket,
  getSocketInstance,
};
