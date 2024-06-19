const { sequelize } = require("../models");

class ProductService {
  constructor(db) {
    this.client = db.sequelize;
    this.Product = db.Product;
  }

  /* Gets all Products */
  async getAllProducts(discount) {
    try {
      const products = await sequelize.query(
        `
          SELECT 
          p.ProductId AS ProductId, 
          p.Name AS Name,
          p.Description AS Description,
          p.UnitPrice AS UnitPrice,
          ${discount} AS Discount,
          p.ImgURL AS ImgURL,
          p.Quantity AS Quantity,
          p.isDeleted AS isDeleted,
          p.BrandId AS BrandId,
          p.CategoryId AS CategoryId,
          b.Brand AS Brand,
          c.Category AS Category,
          DATE_FORMAT(p.createdAt, '%Y-%M-%d %H:%i:%s') AS createdAt,
          DATE_FORMAT(p.updatedAt, '%Y-%M-%d %H:%i:%s') AS updatedAt
          FROM 
              products p
          LEFT JOIN 
              brands b ON p.BrandId = b.BrandId
          LEFT JOIN 
              categories c ON p.CategoryId = c.CategoryId
        `,
        {
          raw: true,
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return products;
    } catch (error) {
      console.error(error);
    }
  }

  /* Gets one Product */
  async getOneProduct(name, value) {
    try {
      return this.Product.findOne({
        where: {
          [name]: value,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Searches for Products by Name, Category and/or Brand */
  async searchProducts(name, category, brand, discount) {
    try {
      let query = `
          SELECT
          p.ProductId AS ProductId,
          p.Name AS Name,
          p.Description AS Description,
          p.ImgURL AS ImgURL,
          p.UnitPrice AS UnitPrice,
          p.Quantity AS Quantity,
          c.Category AS Category,
          b.Brand AS Brand,
          ${discount} AS Discount,
          p.isDeleted AS isDeleted,
          DATE_FORMAT(p.createdAt, '%Y-%M-%d %H:%i:%s') AS createdAt,
          DATE_FORMAT(p.updatedAt, '%Y-%M-%d %H:%i:%s') AS updatedAt
          FROM products p
          LEFT JOIN categories c
          ON p.CategoryId = c.CategoryId
          LEFT JOIN brands b
          ON p.BrandId = b.BrandId
        `;

      if (name) {
        query += `WHERE p.Name LIKE "%${name}%"`;
      }

      if (category) {
        if (!name) {
          query += `WHERE c.Category = "${category}"`;
        } else {
          query += ` AND c.Category = "${category}"`;
        }
      }

      if (brand) {
        if (!name && !category) {
          query += `WHERE b.Brand = "${brand}"`;
        } else {
          query += ` AND b.Brand = "${brand}"`;
        }
      }

      const products = await sequelize.query(query, {
        raw: true,
        type: sequelize.QueryTypes.SELECT,
      });

      return products;
    } catch (error) {
      console.error(error);
    }
  }

  /* Creates a Product */
  async createProduct(
    name,
    description,
    imgUrl,
    unitPrice,
    quantity,
    categoryId,
    brandId,
    dateAdded = false
  ) {
    try {
      const data = {
        Name: name,
        Description: description,
        ImgURL: imgUrl,
        UnitPrice: unitPrice,
        Quantity: quantity,
        CategoryId: categoryId,
        BrandId: brandId,
      };

      if (dateAdded) {
        data.createdAt = dateAdded;
      }

      return this.Product.create(data);
    } catch (error) {
      console.error(error);
    }
  }

  /* Updates a Product */
  async updateProduct(
    productId,
    name,
    description,
    imgUrl,
    unitPrice,
    quantity,
    categoryId,
    brandId,
    isDeleted
  ) {
    try {
      return this.Product.update(
        {
          Name: name,
          Description: description,
          ImgURL: imgUrl,
          UnitPrice: unitPrice,
          Quantity: quantity,
          CategoryId: categoryId,
          BrandId: brandId,
          isDeleted: isDeleted,
        },
        { where: { ProductId: productId } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* Updates a Product Quantity */
  async updateProductQuantity(productId, quantity) {
    try {
      return this.Product.update(
        { Quantity: quantity },
        { where: { ProductId: productId } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* Deletes a Product */
  async deleteProduct(productId) {
    try {
      return this.Product.update(
        { isDeleted: true },
        { where: { ProductId: productId } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* Checks if a Product is deleted */
  async isProductDeleted(productId) {
    try {
      return this.Product.findOne({
        where: { ProductId: productId, isDeleted: true },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async insertProducts() {}
}

module.exports = ProductService;
