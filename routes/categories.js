var express = require("express");
var router = express.Router();
var db = require("../models");
var CategoryService = require("../services/CategoryService");
var categoryService = new CategoryService(db);

var isAdmin = require("../middleware/isAdmin");
var errorMessage = require("../middleware/errorMessage");
var successMessage = require("../middleware/successMessage");
var checkCategory = require("../middleware/checkCategory");

/* Get all Categories */
router.get("/", async (req, res, next) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = 'Gets all categories from the database.'
  // #swagger.responses = [200]
  try {
    const categoryData = await categoryService.getAllCategories();

    return successMessage(
      res,
      "Categories found successfully.",
      "categories",
      categoryData
    );
  } catch (error) {
    return errorMessage(res, "Categories could not be fetched.");
  }
});

/* Create a Category */
router.post("/", isAdmin, checkCategory, async (req, res, next) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = 'Creates a new category.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Category"
      }
    }
  */
  const { category } = req.body;

  try {
    const categoryData = await categoryService.createCategory(category);

    return successMessage(
      res,
      "Category created successfully.",
      "category",
      categoryData
    );
  } catch (error) {
    return errorMessage(res, "Category could not be created.");
  }
});

/* Change a Category */
router.put("/:categoryId", isAdmin, checkCategory, async (req, res, next) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = 'Updates a specific category.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Category"
      }
    }
  */
  const { categoryId } = req.params;
  const { category } = req.body;

  try {
    await categoryService.updateCategory(categoryId, category);

    return successMessage(res, "Category updated successfully.", "category", category);
  } catch (error) {
    return errorMessage(res, "Category could not be updated.");
  }
});

/* Delete a Category */
router.delete("/:categoryId", isAdmin, checkCategory, async (req, res, next) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = 'Deletes a specific category.'
  // #swagger.responses = [200]
  const { categoryId } = req.params;

  try {
    await categoryService.deleteCategory(categoryId);

    return successMessage(res, "Category deleted successfully.");
  } catch (error) {
    return errorMessage(res, "Category could not be deleted.");
  }
});

module.exports = router;
