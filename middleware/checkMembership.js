var db = require("../models");
var MembershipService = require("../services/MembershipService");
var membershipService = new MembershipService(db);
var errorMessage = require("../middleware/errorMessage");

/* Validates Membership Endpoints */
async function checkMembership(req, res, next) {
  const { membershipId } = req.params;
  const { membership, purchases, discount } = req.body;

  try {
    if (membershipId) {
      const existingMembership = await membershipService.getOneMembership(
        "MembershipId",
        membershipId
      );
      if (!existingMembership) {
        return errorMessage(
          res,
          "Membership not found. Please use a valid membership ID."
        );
      }

      /* Validation for DELETE */
      if (req.method === "DELETE") {
        const membershipInUse = await membershipService.membershipInUse(
          membershipId
        );
        if (membershipInUse) {
          return errorMessage(
            res,
            "Membership is in use and cannot be deleted."
          );
        }
        return next();
      }
    }

    /* Validation for POST and PUT */
    if (req.method === "POST" || req.method === "PUT") {
      if (!membership || !purchases || !discount) {
        return errorMessage(
          res,
          "Please provide a membership, purchases and discount."
        );
      }

      if (!/^[a-zA-Z\s]+$/.test(membership)) {
        return errorMessage(
          res,
          "Please only use letters in the membership name."
        );
      }

      if (purchases < 0) {
        return errorMessage(res, "Purchases must be a positive number.");
      }

      if (discount < 0 || discount > 100) {
        return errorMessage(res, "Discount must be between 0 and 100.");
      }

      if (isNaN(purchases) || isNaN(discount)) {
        return errorMessage(res, "Purchases and discount must be numbers.");
      }

      const duplicateMembership = await membershipService.getOneMembership(
        "Membership",
        membership
      );

      if (req.method === "PUT" && duplicateMembership) {
        if (duplicateMembership.MembershipId !== parseInt(membershipId)) {
          return errorMessage(
            res,
            "Membership already exists. Please choose a different name."
          );
        } else {
          return next();
        }
      } else if (duplicateMembership) {
        return errorMessage(
          res,
          "Membership already exists. Please choose a different name."
        );
      }
    }
    next();
  } catch (error) {
    return errorMessage(res, "Could not validate membership.");
  }
}

module.exports = checkMembership;
