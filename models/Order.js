module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("Order", {
    OrderId: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    UserId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },

    StatusId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    OrderNumber: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },

    MembershipId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
    },
  });

  Order.associate = function (models) {
    Order.belongsTo(models.User, { foreignKey: "UserId" });
    Order.belongsTo(models.Status, { foreignKey: "StatusId" });
    Order.belongsTo(models.Membership, { foreignKey: "MembershipId" });
    Order.hasMany(models.OrderItems);
  };

  return Order;
};
