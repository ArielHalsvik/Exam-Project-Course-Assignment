var db = require("../models");
var UserService = require("../services/UserService");
var userService = new UserService(db);
var RoleService = require("../services/RoleService");
var roleService = new RoleService(db);

var validateUser = require("../middleware/validateUser");
var errorMessage = require("../middleware/errorMessage");

async function checkRole(roleId) {
  const existingRole = await roleService.getOneRole("RoleId", roleId);

  if (!existingRole) {
    throw new Error("Invalid roleId, please use a valid role ID.");
  }
  return true;
}

/* Validates Auth Endpoints */
async function checkAuth(req, res, next) {
  const { userId } = req.params;

  /* Checks if User ID exists */
  if (userId) {
    try {
      const existingUser = await userService.getOneUser("Id", userId);
      if (!existingUser) {
        return errorMessage(res, "User not found. Please use a valid user ID.");
      }

      if (req.method === "DELETE") {
        next();
      }
    } catch (error) {
      return errorMessage(res, "Could not validate user.");
    }
  }

  /* Validation for POST /login */
  if (req.method === "POST" && req.url === "/login") {
    const { userName, password } = req.body;

    try {
      if (!userName) {
        return errorMessage(
          res,
          "Please provide either a username or email with the userName key."
        );
      }

      if (!password) {
        return errorMessage(res, "Please provide a password.");
      }

      let user = {};

      if (userName) {
        user = await userService.getOneUser("UserName", userName);
        if (!user) {
          user = await userService.getOneUser("Email", userName);
        }
      }

      if (!user) {
        return errorMessage(res, "User not found.");
      }

      req.user = user;
      next();
    } catch (error) {
      return errorMessage(res, "Could not log in.");
    }

    /* Validation for POST /register */
  } else if (req.method === "POST" && req.url === "/register") {
    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      address,
      telephoneNumber,
    } = req.body;

    try {
      validateUser(
        firstName,
        lastName,
        userName,
        email,
        password,
        address,
        telephoneNumber
      );

      const userByUserName = await userService.getOneUser("UserName", userName);
      if (userByUserName) {
        return errorMessage(
          res,
          "Username already exists. Please choose a different one."
        );
      }

      const userByEmail = await userService.getOneUser("Email", email);
      if (userByEmail) {
        return errorMessage(
          res,
          "Email already exists. Please choose a different one."
        );
      }

      next();
    } catch (error) {
      return errorMessage(res, error.message);
    }

    /* Validation for PUT */
  } else if (req.method === "PUT") {
    const { firstName, lastName, email, address, telephoneNumber, roleId } =
      req.body;

    try {
      validateUser(
        firstName,
        lastName,
        null,
        email,
        null,
        address,
        telephoneNumber,
        false
      );

      await checkRole(roleId);

      const userByEmail = await userService.getOneUser("Email", email);
      if (userByEmail && userByEmail.Id !== parseInt(userId)) {
        return errorMessage(
          res,
          "Email already exists. Please choose a different one."
        );
      }

      next();
    } catch (error) {
      return errorMessage(res, error.message);
    }
  }
}

module.exports = checkAuth;
