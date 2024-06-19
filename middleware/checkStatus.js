var db = require("../models");
var StatusService = require("../services/StatusService");
var statusService = new StatusService(db);
var errorMessage = require("../middleware/errorMessage");

/* Validates Status Endpoints */
async function checkStatus(req, res, next) {
  const { statusId } = req.params;
  const { status } = req.body;

  try {
    if (statusId) {
      const existingStatus = await statusService.getOneStatus(
        "StatusId",
        statusId
      );
      if (!existingStatus) {
        return errorMessage(
          res,
          "Status not found. Please use a valid status ID."
        );
      }

      /* Validation for DELETE */
      if (req.method === "DELETE") {
        const statusInUse = await statusService.statusInUse(statusId);
        if (statusInUse) {
          return errorMessage(res, "Status is in use and cannot be deleted.");
        }
      }
    }

    /* Validation for POST and PUT */
    if (req.method === "POST" || req.method === "PUT") {
      if (!status) {
        return errorMessage(res, "Please provide a status.");
      }

      if (!/^[a-zA-Z\s]+$/.test(status)) {
        return errorMessage(res, "Please only use letters in the status name.");
      }

      const duplicateStatus = await statusService.getOneStatus(
        "Status",
        status
      );
      if (duplicateStatus) {
        return errorMessage(
          res,
          "Status already exists. Please choose a different name."
        );
      }
    }
    next();
  } catch (error) {
    return errorMessage(res, "Could not validate status.");
  }
}

module.exports = checkStatus;
