require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");

const createHttpError = require("./helpers/error-handler");

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

// Error handling
app.use(function (error, req, res, next) {
  const defaultInternalError = createHttpError(500, "Internal server error");

  if (!error?.statusCode || error?.statusCode === 500) {
    res.status(500).send(defaultInternalError);
    console.log(`\n`);
    console.error("\x1b[31m", error);
    console.log(`\n`);
  } else {
    res.status(error.statusCode).send(error);
    console.log(`\n`);
    console.error("\x1b[33m", error);
    console.log(`\n`);
  }
});

// Error 404 handling
app.get("*", function (req, res) {
  const error = createHttpError(404, "Route not found");
  res.status(404).send(error);
});

module.exports = app;
