module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define("Cart", {
    CartId: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    UserId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },

    Status: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      defaultValue: "Active",
    },
  });

  Cart.associate = function (models) {
    Cart.belongsTo(models.User, { foreignKey: "UserId" });
    Cart.hasMany(models.CartItems);
  };

  return Cart;
};
