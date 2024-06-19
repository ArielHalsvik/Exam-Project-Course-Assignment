const { sequelize } = require("../models");

class BrandService {
  constructor(db) {
    this.client = db.sequelize;
    this.Brand = db.Brand;
  }

  /* Gets all Brands */
  async getAllBrands() {
    try {
      return this.Brand.findAll({
        where: {},
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Gets one Brand */
  async getOneBrand(name, value) {
    try {
      return this.Brand.findOne({
        where: {
          [name]: value,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Creates a Brand */
  async createBrand(brand) {
    try {
      return this.Brand.create({
        Brand: brand,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Updates a Brand */
  async updateBrand(brandId, brand) {
    try {
      return this.Brand.update(
        { Brand: brand },
        { where: { BrandId: brandId } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* Deletes a Brand */
  async deleteBrand(brandId) {
    try {
      return this.Brand.destroy({
        where: { BrandId: brandId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Checks if a Brand is in use */
  async brandInUse(brandId) {
    try {
      let data = await this.client.query(
        `SELECT COUNT(*) AS total FROM products WHERE products.BrandId = ${brandId}`,
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

module.exports = BrandService;
