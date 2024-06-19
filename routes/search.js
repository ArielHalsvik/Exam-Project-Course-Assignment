var express = require("express");
var router = express.Router();
var db = require("../models");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var ProductService = require("../services/ProductService");
var productService = new ProductService(db);

var errorMessage = require("../middleware/errorMessage");
var successMessage = require("../middleware/successMessage");
var checkSearch = require("../middleware/checkSearch");
const userDiscount = require("../middleware/userDiscount");

/* Search for Products by Name, Category and/or Brand */
router.post(
  "/",
  jsonParser,
  checkSearch,
  userDiscount,
  // #swagger.tags = ['Utilities']
  // #swagger.description = 'Search for products by name, category and/or brand. Bearer token is optional.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Search"
      }
    }
  */
  async (req, res, next) => {
    let { name, category, brand } = req.body;
    let discount = req.discount;

    try {
      let productData;

      productData = await productService.searchProducts(
        name,
        category,
        brand,
        discount
      );

      const amountOfProducts = productData.length;

      return successMessage(
        res,
        `${amountOfProducts} products found.`,
        "products",
        productData
      );
    } catch (error) {
      return errorMessage(res, "Products could not be fetched.");
    }
  }
);

module.exports = router;
