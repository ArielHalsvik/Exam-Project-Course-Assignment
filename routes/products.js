var express = require("express");
var router = express.Router();
var db = require("../models");
var ProductService = require("../services/ProductService");
var productService = new ProductService(db);

var isAdmin = require("../middleware/isAdmin");
var errorMessage = require("../middleware/errorMessage");
var successMessage = require("../middleware/successMessage");
var checkProduct = require("../middleware/checkProduct");
var userDiscount = require("../middleware/userDiscount");

/* Get all Products */
router.get("/", userDiscount, async (req, res, next) => {
  // #swagger.tags = ['Products']
  // #swagger.description = 'Gets all products from the database.'
  // #swagger.responses = [200]
  try {
    const discount = req.discount;
    const productData = await productService.getAllProducts(discount);

    return successMessage(
      res,
      "Products found successfully.",
      "products",
      productData
    );
  } catch (error) {
    return errorMessage(res, "Products could not be fetched.");
  }
});

/* Create a Product */
router.post("/", isAdmin, checkProduct, async (req, res, next) => {
  // #swagger.tags = ['Products']
  // #swagger.description = 'Creates a new product.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Product"
      }
    }
  */
  const {
    name,
    description,
    imgUrl,
    unitPrice,
    quantity,
    categoryId,
    brandId,
  } = req.body;

  try {
    const productData = await productService.createProduct(
      name,
      description,
      imgUrl,
      unitPrice,
      quantity,
      categoryId,
      brandId
    );

    return successMessage(
      res,
      "Product created successfully.",
      "product",
      productData
    );
  } catch (error) {
    return errorMessage(res, "Product could not be created.");
  }
});

/* Change a Product */
router.put("/:productId", isAdmin, checkProduct, async (req, res, next) => {
  // #swagger.tags = ['Products']
  // #swagger.description = 'Updates a specific product.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/ProductEdit"
      }
    }
  */
  const { productId } = req.params;
  const {
    name,
    description,
    imgUrl,
    unitPrice,
    quantity,
    categoryId,
    brandId,
    isDeleted,
  } = req.body;

  try {
    await productService.updateProduct(
      productId,
      name,
      description,
      imgUrl,
      unitPrice,
      quantity,
      categoryId,
      brandId,
      isDeleted
    );

    return successMessage(res, "Product updated successfully.", "product", req.body);
  } catch (error) {
    return errorMessage(res, "Product could not be updated.");
  }
});

/* Delete a Product */
router.delete("/:productId", isAdmin, checkProduct, async (req, res, next) => {
  // #swagger.tags = ['Products']
  // #swagger.description = 'Deletes a specific product.'
  // #swagger.responses = [200]
  const { productId } = req.params;

  try {
    await productService.deleteProduct(productId);

    return successMessage(res, "Product deleted successfully.");
  } catch (error) {
    return errorMessage(res, "Product could not be deleted.");
  }
});

module.exports = router;
