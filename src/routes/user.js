const router = require("express").Router();
const validate = require("validate.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../services/user/user");

const createHttpError = require("../helpers/error-handler");
const promisesHelper = require("../helpers/promises");
const passwordHelper = require("../helpers/password");

router.get("/", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (info) return next(info);
    if (err) return next(err);

    User.FindAllUsers()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => next(promisesHelper.HandlePromiseRejection(error)));
  })(req, res, next);
});

router.post("/", (req, res, next) => {
  const constraints = {
    name: {
      presence: true,
      length: {
        minimum: 3,
        maximum: 20,
        message: "Name must be a minimum of 3 characters and maximum 20",
      },
    },
    email: {
      presence: true,
      email: { message: "^Invalid e-mail address" },
    },
    password: {
      presence: true,
      length: {
        minimum: 5,
        maximum: 30,
        message: "Password must be a minimum of 5 characters and maximum 30",
      },
    },
  };
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const validation = validate(user, constraints);
  if (validation) return next(createHttpError(400, validation));

  User.CreateUser(user)
    .then(([results, created]) => {
      if (!created)
        return next(
          createHttpError(400, `Email ${user.email} is already taken`)
        );
      else {
        const { salt, ...user } = results.dataValues;
        return res.status(200).json(user);
      }
    })
    .catch((error) => next(promisesHelper.HandlePromiseRejection(error)));
});

router.put("/", (req, res, next) => {
  const constraints = {
    name: {
      presence: false,
      length: {
        minimum: 3,
        maximum: 20,
        message: "Name must be a minimum of 3 characters and maximum 20",
      },
    },
    email: {
      presence: false,
      email: { message: "^Invalid e-mail address" },
    },
    password: {
      presence: false,
      length: {
        minimum: 5,
        maximum: 30,
        message: "Password must be a minimum of 5 characters and maximum 30",
      },
    },
    id: {
      presence: true,
    },
  };
  const user = { ...req.body };

  const validation = validate(user, constraints);
  if (validation) return next(createHttpError(400, validation));

  User.UpdateUser(user)
    .then((response) => {
      let affectedRows = response[0];
      if (affectedRows <= 0)
        return next(createHttpError(400, "User was not updated"));
      else {
        return res.status(200).json(affectedRows);
      }
    })
    .catch((error) => next(promisesHelper.HandlePromiseRejection(error)));
});

router.delete("/", (req, res, next) => {
  const constraints = {
    id: {
      presence: true,
    },
  };
  const user = { ...req.body };

  const validation = validate(user, constraints);
  if (validation) return next(createHttpError(400, validation));

  User.DeleteUserById(user.id)
    .then((affectedRows) => {
      if (affectedRows <= 0)
        return next(createHttpError(400, "User was not deleted"));
      else {
        return res.status(200).json(affectedRows);
      }
    })
    .catch((error) => next(promisesHelper.HandlePromiseRejection(error)));
});

router.get("/me", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (info) return next(info);
    if (err) return next(err);

    res.status(200).json(user);
  })(req, res, next);
});

router.post("/login", (req, res, next) => {
  const constraints = {
    email: {
      presence: true,
      email: { message: "^Invalid e-mail address" },
    },
    password: {
      presence: true,
      length: {
        minimum: 5,
        maximum: 30,
        message: "Password must be a minimum of 5 characters and maximum 30",
      },
    },
  };
  const user = {
    email: req?.body?.email,
    password: req?.body?.password,
  };

  const validation = validate(user, constraints);
  if (validation) return next(createHttpError(400, validation));

  User.FindUserByEmail(user.email)
    .then((dbRes) => {
      if (!dbRes) return next(createHttpError(400, "User not found"));
      const foundUser = dbRes.dataValues;

      if (!passwordHelper.UserPasswordIsValid(foundUser, user.password)) {
        return next(createHttpError(400, "Invalid password"));
      }

      //Generate a signed web token with the contents of user object and return it in the response
      const token = jwt.sign(user, process.env.SECRET_SESSION_KEY, {
        expiresIn: "240m",
      });
      const { salt, ...loginUser } = foundUser;
      loginUser.token = `Bearer ${token}`;

      req.logIn(loginUser, { session: false }, (err) => {
        if (err) return next(createHttpError(500, err));
        res.status(200).json(req.user);
      });
    })
    .catch((error) => next(promisesHelper.HandlePromiseRejection(error)));
});

module.exports = router;
