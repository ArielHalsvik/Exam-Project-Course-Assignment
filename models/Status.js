module.exports = (sequelize, Sequelize) => {
  const Status = sequelize.define(
    "Status",
    {
      StatusId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      Status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Status.associate = function (models) {
    Status.hasMany(models.Order);
  };

  return Status;
};
