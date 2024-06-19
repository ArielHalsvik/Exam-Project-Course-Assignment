const { sequelize } = require("../models");

class CategoryService {
  constructor(db) {
    this.client = db.sequelize;
    this.Category = db.Category;
  }

  /* Gets all Categories */
  async getAllCategories() {
    try {
      return this.Category.findAll({
        where: {},
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Gets one Category */
  async getOneCategory(name, value) {
    try {
      return this.Category.findOne({
        where: {
          [name]: value,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Creates a Category */
  async createCategory(category) {
    try {
      return this.Category.create({
        Category: category,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Updates a Category */
  async updateCategory(categoryId, category) {
    try {
      return this.Category.update(
        { Category: category },
        { where: { CategoryId: categoryId } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* Deletes a Category */
  async deleteCategory(categoryId) {
    try {
      return this.Category.destroy({
        where: { CategoryId: categoryId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Checks if Category is in use */
  async categoryInUse(categoryId) {
    try {
      let data = await this.client.query(
        `SELECT COUNT(*) AS total FROM products WHERE products.CategoryId = ${categoryId}`,
        {
          raw: true,
          type: sequelize.QueryTypes.SELECT,
        }
      );
      if (data[0].total > 0) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = CategoryService;
