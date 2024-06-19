module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    "Category",
    {
      CategoryId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      Category: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Category.associate = function (models) {
    Category.hasMany(models.Product);
  };

  return Category;
};
