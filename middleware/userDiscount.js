var jwt = require("jsonwebtoken");
var db = require("../models");
var MembershipService = require("../services/MembershipService");
var membershipService = new MembershipService(db);
var UserService = require("../services/UserService");
var userService = new UserService(db);

/* Checks User's Discount */
async function userDiscount(req, res, next) {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token && req.cookies) {
    token = req.cookies.token;
  }

  if (!token) {
    req.discount = 0;
    return next();
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await userService.getOneUser("Id", verified.userId);
    const membership = await membershipService.getOneMembership(
      "MembershipId",
      user.MembershipId
    );

    req.membershipId = user.MembershipId;
    req.discount = membership.Discount;
    return next();
  } catch (error) {
    req.discount = 0;
    return next();
  }
}

module.exports = userDiscount;
