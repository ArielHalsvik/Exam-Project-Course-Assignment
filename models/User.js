module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      Id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      FirstName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      LastName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      UserName: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false,
      },

      Email: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false,
      },

      EncryptedPassword: {
        type: Sequelize.DataTypes.BLOB,
        allowNull: false,
      },

      Salt: {
        type: Sequelize.DataTypes.BLOB,
        allowNull: false,
      },

      Address: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },

      TelephoneNumber: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },

      RoleId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },

      MembershipId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      timestamps: false,
    }
  );

  User.associate = function (models) {
    User.belongsTo(models.Role, { foreignKey: "RoleId" });
    User.belongsTo(models.Membership, { foreignKey: "MembershipId" });
    User.hasMany(models.Order);
    User.hasMany(models.Cart);
  };

  return User;
};
