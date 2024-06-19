module.exports = (sequelize, Sequelize) => {
  const Membership = sequelize.define(
    "Membership",
    {
      MembershipId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      Membership: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      Purchases: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },

      Discount: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Membership.associate = function (models) {
    Membership.hasMany(models.User);
    Membership.hasMany(models.Order);
  };

  return Membership;
};
