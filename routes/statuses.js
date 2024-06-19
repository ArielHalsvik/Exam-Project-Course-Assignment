var express = require("express");
var router = express.Router();
var db = require("../models");
var StatusService = require("../services/StatusService");
var statusService = new StatusService(db);

var isAdmin = require("../middleware/isAdmin");
var errorMessage = require("../middleware/errorMessage");
var successMessage = require("../middleware/successMessage");
var checkStatus = require("../middleware/checkStatus");

/* Get all Statuses */
router.get("/", async (req, res, next) => {
  // #swagger.tags = ['Statuses']
  // #swagger.description = 'Gets all statuses from the database.'
  // #swagger.responses = [200]
  try {
    const statusData = await statusService.getAllStatuses();

    return successMessage(
      res,
      "Statuses found successfully.",
      "statuses",
      statusData
    );
  } catch (error) {
    return errorMessage(res, "Statuses could not be fetched.");
  }
});

/* Create a Status */
router.post("/", isAdmin, checkStatus, async (req, res, next) => {
  // #swagger.tags = ['Statuses']
  // #swagger.description = 'Creates a new status.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Status"
      }
    }
  */
  const { status } = req.body;

  try {
    const statusData = await statusService.createStatus(status);

    return successMessage(
      res,
      "Status created successfully.",
      "status",
      statusData
    );
  } catch (error) {
    return errorMessage(res, "Status could not be created.");
  }
});

/* Change a Status */
router.put("/:statusId", isAdmin, checkStatus, async (req, res, next) => {
  // #swagger.tags = ['Statuses']
  // #swagger.description = 'Updates a specific status.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Status"
      }
    }
  */
  const { statusId } = req.params;
  const { status } = req.body;

  try {
    await statusService.updateStatus(statusId, status);

    return successMessage(res, "Status updated successfully.", "status", status);
  } catch (error) {
    return errorMessage(res, "Status could not be updated.");
  }
});

/* Delete a Status */
router.delete("/:statusId", isAdmin, checkStatus, async (req, res, next) => {
  // #swagger.tags = ['Statuses']
  // #swagger.description = 'Deletes a specific status.'
  // #swagger.responses = [200]
  const { statusId } = req.params;

  try {
    await statusService.deleteStatus(statusId);

    return successMessage(res, "Status deleted successfully.");
  } catch (error) {
    return errorMessage(res, "Status could not be deleted.");
  }
});

module.exports = router;
