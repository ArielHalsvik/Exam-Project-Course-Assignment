var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var db = require("../models");
var UserService = require("../services/UserService");
var userService = new UserService(db);

var errorMessage = require("../middleware/errorMessage");
var successMessage = require("../middleware/successMessage");

/* Creates Registered and Admin Users */
function createUser(req, res, type) {
  let user = req.body;
  const salt = crypto.randomBytes(16);

  if (type === "admin") {
    try {
      user = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, "../data/adminUser.json"),
          "utf8"
        )
      );
    } catch (error) {
      return errorMessage(res, "Could not read admin user data.");
    }
  }

  try {
    crypto.pbkdf2(
      user.password,
      salt,
      310000,
      32,
      "sha256",
      async (error, encryptedPassword) => {
        if (error) {
          return errorMessage(res, "Could not create encrypted password.");
        }
        let registeredUser;

        if (type === "admin") {
          try {
            const roleId = 1;
            registeredUser = await userService.createUser(
              user.firstName,
              user.lastName,
              user.userName,
              user.email,
              encryptedPassword,
              salt,
              user.address,
              user.telephoneNumber,
              roleId
            );
          } catch (error) {
            return errorMessage(
              res,
              "Could not insert admin user in database."
            );
          }
        } else {
          try {
            const roleId = 2;
            registeredUser = await userService.createUser(
              user.firstName,
              user.lastName,
              user.userName,
              user.email,
              encryptedPassword,
              salt,
              user.address,
              user.telephoneNumber,
              roleId
            );
            return successMessage(
              res,
              "User registered successfully.",
              "user",
              registeredUser
            );
          } catch (error) {
            return errorMessage(
              res,
              "Could not insert registered user in database."
            );
          }
        }
      }
    );
  } catch (error) {
    return errorMessage(res, "Could not create user.");
  }
}

module.exports = createUser;
