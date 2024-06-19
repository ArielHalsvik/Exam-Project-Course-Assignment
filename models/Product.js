module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("Product", {
    ProductId: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    Name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },

    Description: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },

    ImgURL: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },

    UnitPrice: {
      type: Sequelize.DataTypes.DECIMAL,
      allowNull: false,
    },

    Quantity: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },

    CategoryId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },

    BrandId: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },

    isDeleted: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  Product.associate = function (models) {
    Product.belongsTo(models.Category, { foreignKey: "CategoryId" });
    Product.belongsTo(models.Brand, { foreignKey: "BrandId" });
    Product.hasMany(models.OrderItem);
    Product.hasMany(models.CartItem);
  };

  return Product;
};
