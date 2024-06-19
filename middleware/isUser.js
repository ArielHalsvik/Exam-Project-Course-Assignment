var jwt = require("jsonwebtoken");
var errorMessage = require("../middleware/errorMessage");

/* Checks if User is a Registered User or an Admin */
function isUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return errorMessage(res, "Access denied. No token provided.");
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    if (verified.roleId === 1 || verified.roleId === 2) {
      req.user = verified;
      next();
    } else {
      return errorMessage(
        res,
        "Access denied. Not a user. Please create an account to access this feature."
      );
    }
  } catch (error) {
    return errorMessage(res, "Access denied. Invalid token.");
  }
}

module.exports = isUser;
