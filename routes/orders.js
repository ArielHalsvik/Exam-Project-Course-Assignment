var express = require("express");
var router = express.Router();
var db = require("../models");
var OrderService = require("../services/OrderService");
var orderService = new OrderService(db);

var isAdmin = require("../middleware/isAdmin");
var isUser = require("../middleware/isUser");
var errorMessage = require("../middleware/errorMessage");
var successMessage = require("../middleware/successMessage");
var checkOrder = require("../middleware/checkOrder");

/* Get all Orders */
router.get("/", isUser, async (req, res, next) => {
  // #swagger.tags = ['Orders']
  // #swagger.description = 'Gets all orders from the database for admins, and all orders a user has made for the user.'
  // #swagger.responses = [200]
  const userId = req.user.userId;
  const roleId = req.user.roleId;

  let orderData;
  try {
    if (roleId === 1) {
      orderData = await orderService.getAllOrders();
    } else {
      orderData = await orderService.getAllOrders(userId);
    }

    return successMessage(
      res,
      "Orders found successfully.",
      "orders",
      orderData
    );
  } catch (error) {
    return errorMessage(res, "Orders could not be fetched.");
  }
});

/* Change a Order */
router.put("/:orderId", isAdmin, checkOrder, async (req, res, next) => {
  // #swagger.tags = ['Orders']
  // #swagger.description = 'Updates the status of a specific order.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Order"
      }
    }
  */
  const { orderId } = req.params;
  const { statusId } = req.body;

  try {
    await orderService.updateOrder(orderId, statusId);

    return successMessage(res, "Order status updated successfully.", "orderId", orderId, "statusId", statusId);
  } catch (error) {
    return errorMessage(res, "Order status could not be updated.");
  }
});

/* Delete a Order */
router.delete("/:orderId", isAdmin, checkOrder, async (req, res, next) => {
  // #swagger.tags = ['Orders']
  // #swagger.description = 'Deletes a specific order.'
  // #swagger.responses = [200]
  try {
    const { orderId } = req.params;

    await orderService.deleteOrder(orderId);

    return successMessage(res, "Order deleted successfully.");
  } catch (error) {
    return errorMessage(res, "Order could not be deleted.");
  }
});

module.exports = router;
