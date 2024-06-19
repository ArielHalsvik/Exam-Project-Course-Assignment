var jwt = require("jsonwebtoken");
var errorMessage = require("../middleware/errorMessage");

/* Checks if User is an Admin */
function isAdmin(req, res, next) {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    token = req.cookies.token;
    if (!token) {
      return errorMessage(res, "Access denied. No token provided.");
    }
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    if (verified.roleId === 1) {
      req.user = verified;
      next();
    } else {
      return errorMessage(res, "Access denied. Not an admin.");
    }
  } catch (error) {
    return errorMessage(res, "Access denied. Invalid token.");
  }
}

module.exports = isAdmin;
