module.exports = (sequelize, Sequelize) => {
  const CartItem = sequelize.define("CartItem", {
    CartItemId: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    CartId: {
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

  CartItem.associate = function (models) {
    CartItem.belongsTo(models.Cart, { foreignKey: "CartId" });
    CartItem.belongsTo(models.Product, { foreignKey: "ProductId" });
  };

  return CartItem;
};
