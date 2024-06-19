const { sequelize } = require("../models");

class OrderItemService {
  constructor(db) {
    this.client = db.sequelize;
    this.OrderItem = db.OrderItem;
  }

  /* Gets all Order Items for the Logged in User */
  async getAllOrderItemsTotal(userId) {
    try {
      let data = await this.client.query(
        `
          SELECT SUM(Quantity) AS total
          FROM orderitems i
          LEFT JOIN orders o ON i.OrderId = o.OrderId
          WHERE o.UserId = ${userId}
        `,
        {
          raw: true,
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return data[0].total;
    } catch (error) {
      console.error(error);
    }
  }

  /* Gets all Order Items from one Order */
  async getAllOrderItems(orderId) {
    try {
      return this.OrderItem.findAll({
        where: { OrderId: orderId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Creates an Order Item */
  async createOrderItem(orderId, productId, quantity, unitPrice) {
    try {
      return this.OrderItem.create({
        OrderId: orderId,
        ProductId: productId,
        Quantity: quantity,
        UnitPrice: unitPrice,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = OrderItemService;
