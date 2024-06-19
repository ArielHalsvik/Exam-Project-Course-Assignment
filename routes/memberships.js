var express = require("express");
var router = express.Router();
var db = require("../models");
var MembershipService = require("../services/MembershipService");
var membershipService = new MembershipService(db);

var isAdmin = require("../middleware/isAdmin");
var errorMessage = require("../middleware/errorMessage");
var successMessage = require("../middleware/successMessage");
var checkMembership = require("../middleware/checkMembership");

/* Get all Memberships */
router.get("/", async (req, res, next) => {
  // #swagger.tags = ['Memberships']
  // #swagger.description = 'Gets all memberships from the database.'
  // #swagger.responses = [200]
  try {
    const membershipData = await membershipService.getAllMemberships();

    return successMessage(
      res,
      "Memberships found successfully.",
      "memberships",
      membershipData
    );
  } catch (error) {
    return errorMessage(res, "Memberships could not be fetched.");
  }
});

/* Create a Membership */
router.post("/", isAdmin, checkMembership, async (req, res, next) => {
  // #swagger.tags = ['Memberships']
  // #swagger.description = 'Creates a new membership.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Membership"
      }
    }
  */
  const { membership, purchases, discount } = req.body;

  try {
    const membershipData = await membershipService.createMembership(
      membership,
      purchases,
      discount
    );

    return successMessage(
      res,
      "Membership created successfully.",
      "membership",
      membershipData
    );
  } catch (error) {
    return errorMessage(res, "Membership could not be created.");
  }
});

/* Change a Membership */
router.put(
  "/:membershipId",
  isAdmin,
  checkMembership,
  async (req, res, next) => {
    // #swagger.tags = ['Memberships']
    // #swagger.description = 'Updates a specific membership.'
    // #swagger.responses = [200]
    /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Membership"
      }
    }
  */
    const { membershipId } = req.params;
    const { membership, purchases, discount } = req.body;

    try {
      await membershipService.updateMembership(
        membershipId,
        membership,
        purchases,
        discount
      );

      return successMessage(
        res,
        "Membership updated successfully.",
        "membership",
        req.body
      );
    } catch (error) {
      return errorMessage(res, "Membership could not be updated.");
    }
  }
);

/* Delete a Membership */
router.delete(
  "/:membershipId",
  isAdmin,
  checkMembership,
  async (req, res, next) => {
    // #swagger.tags = ['Memberships']
    // #swagger.description = 'Deletes a specific membership.'
    // #swagger.responses = [200]
    const { membershipId } = req.params;

    try {
      await membershipService.deleteMembership(membershipId);

      return successMessage(res, "Membership deleted successfully.");
    } catch (error) {
      return errorMessage(res, "Membership could not be deleted.");
    }
  }
);

module.exports = router;
