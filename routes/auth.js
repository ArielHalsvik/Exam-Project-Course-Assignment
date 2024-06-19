var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var db = require("../models");
var UserService = require("../services/UserService");
var userService = new UserService(db);

var errorMessage = require("../middleware/errorMessage");
var successMessage = require("../middleware/successMessage");
var createUser = require("../middleware/createUser");
var checkAuth = require("../middleware/checkAuth");
var isAdmin = require("../middleware/isAdmin");

/* Get all Users */
router.get("/", isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Gets all users from the database.'
  // #swagger.responses = [200]
  try {
    const userData = await userService.getAllUsers();

    return successMessage(res, "Users found successfully.", "users", userData);
  } catch (error) {
    return errorMessage(res, "Users could not be fetched.");
  }
});

/* Login for Users */
router.post("/login", jsonParser, checkAuth, async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Login with either an email or a username, and a password. Returns a webtoken. Use this for access to other admin endpoints in this format: "Bearer: " + token. If the database is not filled yet, please POST "/init" under "Utilities" before proceeding.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/UserLogin"
      }
    }
  */
  const { password } = req.body;
  const user = req.user;

  const saltHex = user.Salt;
  const storedEncryptedPassword = user.EncryptedPassword;

  try {
    crypto.pbkdf2(
      password,
      saltHex,
      310000,
      32,
      "sha256",
      async (error, hashedPassword) => {
        if (error) {
          return errorMessage(res, "Could not create encrypted password.");
        }

        const hashedPasswordHex = hashedPassword.toString("hex");

        if (hashedPasswordHex === storedEncryptedPassword.toString("hex")) {
          let token;
          try {
            token = jwt.sign(
              {
                roleId: user.RoleId,
                userId: user.Id,
                firstName: user.FirstName,
              },
              process.env.TOKEN_SECRET,
              {
                expiresIn: "2h",
              }
            );

            res.cookie("token", token, { httpOnly: true, secure: true });
          } catch (error) {
            return errorMessage(res, "Could not create token.");
          }

          return successMessage(
            res,
            "User logged in successfully.",
            "roleId",
            user.RoleId,
            "userId",
            user.Id,
            "firstName",
            user.FirstName,
            "token",
            token
          );
        } else {
          return errorMessage(res, "Incorrect password.");
        }
      }
    );
  } catch (error) {
    return errorMessage(res, "Failed to login.");
  }
});

/* Register for Users */
router.post("/register", checkAuth, async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Registers a new user'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/UserRegister"
      }
    }
  */
  let user = "user";

  try {
    createUser(req, res, user);
  } catch (error) {
    return errorMessage(res, "Could not create user.");
  }
});

/* Change a User */
router.put("/:userId", isAdmin, checkAuth, async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Updates a specific user.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/UserEdit"
      }
    }
  */
  const { userId } = req.params;
  const { firstName, lastName, email, address, telephoneNumber, roleId } =
    req.body;

  try {
    await userService.updateUser(
      userId,
      firstName,
      lastName,
      email,
      address,
      telephoneNumber,
      roleId
    );

    return successMessage(res, "User updated successfully.", "user", req.body);
  } catch (error) {
    return errorMessage(res, "Could not update user.");
  }
});

/* Delete a User */
router.delete("/:userId", isAdmin, checkAuth, async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Deletes a specific user.'
  // #swagger.responses = [200]
  const { userId } = req.params;

  try {
    await userService.deleteUser(userId);

    return successMessage(res, "User deleted successfully.");
  } catch (error) {
    return errorMessage(res, "Could not delete user.");
  }
});

module.exports = router;
