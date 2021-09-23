require("dotenv").config();
require("express-async-errors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const http = require("http");

const {
  normalizePort,
  onError,
  onListening,
} = require("./helpers/server-utils");
const {
  error404Handler,
  globalRouteErrorHandler,
} = require("./helpers/route-error-handler");

const app = express();

// Sequelize config
const db = require("./models");
db.sequelize.sync().catch((e) => console.error(e));

// Passport config
require("./config/passport");

// Default config
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("json replacer", (k, v) => (v === null ? undefined : v));

// Passport authentication
app.use(
  session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/user", require("./routes/user"));
app.use("/chat", require("./routes/chat"));

// Socket
const server = http.createServer(app);
const ws = require("./config/socket.io");
ws.initSocket(server);
require("./socket/chat");

// Error handling
app.use(globalRouteErrorHandler);
app.get("*", error404Handler);

// Listen
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
server.listen(port);
server.on("error", onError);
server.on("listening", () => onListening(server));
