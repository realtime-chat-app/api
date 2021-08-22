const router = require("express").Router();
const jwt = require("jsonwebtoken");

const userService = require("../services/user");

const authenticate = require("../helpers/route-authentication");
const passwordHelper = require("../helpers/password");

const parseRouteError = require("../error/parse-route-error");
const httpError = require("../error/http-error");

const {
  CreateUserRequestEntity,
  UpdateUserRequestEntity,
  LoginUserRequestEntity,
} = require("../entities/user");

router.get("/", (req, res, next) => {
  authenticate(req, res, next, () => {
    userService
      .FindAllUsers()
      .then((users) => res.status(200).json(users))
      .catch((error) => next(parseRouteError(error)));
  });
});

router.post("/", (req, res, next) => {
  let user = null;

  try {
    user = new CreateUserRequestEntity({ ...req.body });
  } catch (error) {
    return next(httpError(400, error.message));
  }

  userService
    .CreateUser(user)
    .then(([results, created]) =>
      created
        ? res.status(200).json(results.dataValues)
        : next(httpError(400, `Email ${user.email} is already taken`))
    )
    .catch((error) => next(parseRouteError(error)));
});

router.put("/", (req, res, next) => {
  let user = null;

  try {
    user = new UpdateUserRequestEntity({ ...req.body });
  } catch (error) {
    return next(httpError(400, error.message));
  }

  authenticate(req, res, next, () => {
    userService
      .UpdateUser(user)
      .then((response) =>
        response
          ? res.status(200).json(response)
          : next(httpError(400, "User was not updated"))
      )
      .catch((error) => next(parseRouteError(error)));
  });
});

router.delete("/:id", (req, res, next) => {
  authenticate(req, res, next, () => {
    userService
      .DeleteUserById(req.params.id)
      .then((response) =>
        response
          ? res.status(200).json(response)
          : next(httpError(400, "User was not deleted"))
      )
      .catch((error) => next(parseRouteError(error)));
  });
});

router.get("/me", (req, res, next) =>
  authenticate(req, res, next, (user) => res.status(200).json(user))
);

router.post("/login", (req, res, next) => {
  let user = null;

  try {
    user = new LoginUserRequestEntity({ ...req.body });
  } catch (error) {
    return next(httpError(400, error.message));
  }

  userService
    .FindUserByEmail(user.email)
    .then((svcRes) => {
      if (!svcRes) return next(httpError(400, "User not found"));
      const foundUser = svcRes.dataValues;

      if (!passwordHelper.UserPasswordIsValid(foundUser, user.password)) {
        return next(httpError(400, "Invalid password"));
      }

      //Generate a signed web token with the contents of user object and return it in the response
      const token = jwt.sign({ ...foundUser }, process.env.SECRET_SESSION_KEY, {
        expiresIn: "240m",
      });
      const { salt, ...loginUser } = foundUser;
      loginUser.token = `Bearer ${token}`;

      req.logIn(loginUser, { session: false }, (err) => {
        if (err) return next(httpError(500, err));
        res.status(200).json(req.user);
      });
    })
    .catch((error) => next(parseRouteError(error)));
});

module.exports = router;
