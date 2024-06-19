module.exports = (sequelize, Sequelize) => {
  const Brand = sequelize.define(
    "Brand",
    {
      BrandId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      Brand: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Brand.associate = function (models) {
    Brand.hasMany(models.Product);
  };

  return Brand;
};
