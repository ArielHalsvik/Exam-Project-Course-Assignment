const { sequelize } = require("../models");

class OrderService {
  constructor(db) {
    this.client = db.sequelize;
    this.Order = db.Order;
  }

  /* Gets all Orders Depending on the User */
  async getAllOrders(userId) {
    try {
      const ifUser = userId ? `WHERE o.UserId = ${userId}` : "";
      const orders = await sequelize.query(
        `
          SELECT
            o.OrderId AS OrderId,
            o.UserId AS UserId,
            s.Status AS Status,
            o.OrderNumber AS OrderNumber,
            m.Membership AS Membership,
            m.Discount AS 'Discount(%)',
            DATE_FORMAT(o.createdAt, '%Y-%M-%d %H:%i:%s') AS createdAt,
            DATE_FORMAT(o.updatedAt, '%Y-%M-%d %H:%i:%s') AS updatedAt,
            GROUP_CONCAT(DISTINCT p.Name SEPARATOR ', ') AS Products
          FROM 
              orders o
          LEFT JOIN 
              memberships m ON o.MembershipId = m.MembershipId
          LEFT JOIN 
              statuses s ON o.StatusId = s.StatusId
          LEFT JOIN
            orderitems i ON o.OrderId = i.OrderId
          LEFT JOIN
            products p on i.ProductId = p.ProductId
          ${ifUser}
          GROUP BY
            o.OrderId, o.UserId, s.Status, o.OrderNumber, m.Membership, m.Discount
        `,
        {
          raw: true,
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return orders;
    } catch (error) {
      console.error(error);
    }
  }

  /* Gets a Specific Order */
  async getOneOrder(orderId) {
    try {
      return this.Order.findOne({
        where: { OrderId: orderId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Creates an Order for a User */
  async createOrder(userId, orderNumber, membershipId) {
    try {
      return this.Order.create({
        UserId: userId,
        OrderNumber: orderNumber,
        MembershipId: membershipId,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Updates the Status for an Order */
  async updateOrder(orderId, statusId) {
    try {
      return this.Order.update(
        { StatusId: statusId },
        { where: { OrderId: orderId } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* Deletes an Order */
  async deleteOrder(orderId) {
    try {
      return this.Order.destroy({
        where: { OrderId: orderId },
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = OrderService;
