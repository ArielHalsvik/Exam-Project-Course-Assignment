module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    "Role",
    {
      RoleId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      Role: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Role.associate = function (models) {
    Role.hasMany(models.User);
  };

  return Role;
};
