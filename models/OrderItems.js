const Order = require("./Order");

module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define("OrderItem", {
    OrderItemId: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    OrderId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },

    ProductId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },

    Quantity: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },

    UnitPrice: {
      type: Sequelize.DataTypes.DECIMAL,
      allowNull: false,
    },
  });

  OrderItem.associate = function (models) {
    OrderItem.belongsTo(models.Order, { foreignKey: "OrderId" });
    OrderItem.belongsTo(models.Product, { foreignKey: "ProductId" });
  };

  return OrderItem;
};
