var express = require("express");
var router = express.Router();
var db = require("../models");
const { sequelize } = require("../models");

var RoleService = require("../services/RoleService");
var roleService = new RoleService(db);
var StatusService = require("../services/StatusService");
var statusService = new StatusService(db);
var ProductService = require("../services/ProductService");
var productService = new ProductService(db);
var MembershipService = require("../services/MembershipService");
var membershipService = new MembershipService(db);

var errorMessage = require("../middleware/errorMessage");
var successMessage = require("../middleware/successMessage");
var createUser = require("../middleware/createUser");

/* Populate Database */
router.post("/", async (req, res, next) => {
  // #swagger.tags = ['Utilities']
  // #swagger.description = 'Populates the database.'
  // #swagger.responses = [200]
  if (await findDataInDB()) {
    console.log("Database has no data, inserting data now.");

    /* Populate Database from Noroff API */
    try {
      const response = await fetch(
        "http://backend.restapi.co.za/items/products"
      );

      if (!response.ok) {
        return errorMessage(res, "Products could not be fetched from the API.");
      }

      const responseData = await response.json();
      if (!responseData) {
        return errorMessage(res, "No JSON data returned from the API.");
      }

      const data = responseData.data;
      for (const item of data) {
        const [brand] = await db.Brand.findOrCreate({
          where: { Brand: item.brand },
        });

        const [category] = await db.Category.findOrCreate({
          where: { Category: item.category },
        });

        const brandId = brand.dataValues.BrandId;
        const categoryId = category.dataValues.CategoryId;

        await productService.createProduct(
          item.name,
          item.description,
          item.imgurl,
          item.price,
          item.quantity,
          categoryId,
          brandId,
          item.date_added
        );
      }
    } catch (error) {
      return errorMessage(
        res,
        "The database could not be populated from the noroff API."
      );
    }

    // /* Inserts Admin User in Database */
    try {
      let admin = "admin";
      createUser(req, res, admin);
    } catch (error) {
      return errorMessage(res, "Failed to insert admin user data.");
    }

    /* Filling the Other Tables */
    try {
      await roleService.insertRoles();
      await statusService.insertStatuses();
      await membershipService.insertMemberships();
    } catch (error) {
      return errorMessage(
        res,
        "Could not insert roles, statuses or memberships."
      );
    }

    return successMessage(res, "The database has been populated.");
  } else {
    return errorMessage(res, "Database already has data.");
  }
});

/* Function to Check if Database is Empty */
const findDataInDB = async () => {
  let products = await db.sequelize.query(
    "SELECT COUNT(*) AS total FROM products",
    {
      raw: true,
      type: sequelize.QueryTypes.SELECT,
    }
  );

  if (products[0].total == 0) {
    return true;
  }
  return false;
};

module.exports = router;
