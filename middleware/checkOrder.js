var db = require("../models");
var OrderService = require("../services/OrderService");
var orderService = new OrderService(db);
var StatusService = require("../services/StatusService");
var statusService = new StatusService(db);
var errorMessage = require("../middleware/errorMessage");

/* Validates Order Endpoints */
async function checkOrder(req, res, next) {
  const { orderId } = req.params;
  const { statusId } = req.body;

  try {
    if ((!statusId || isNaN(statusId)) && req.method === "PUT") {
      return errorMessage(res, "Please provide a valid status ID.");
    }

    const existingOrder = await orderService.getOneOrder(orderId);
    if (!existingOrder) {
      return errorMessage(res, "Order not found.");
    }

    const existingStatus = await statusService.getOneStatus("StatusId", statusId);
    if (!existingStatus) {
      return errorMessage(res, "Status not found.");
    }

    next();
  } catch (error) {
    return errorMessage(res, error.message);
  }
}

module.exports = checkOrder;
