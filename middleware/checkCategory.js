var db = require("../models");
var CategoryService = require("../services/CategoryService");
var categoryService = new CategoryService(db);
var errorMessage = require("../middleware/errorMessage");

/* Validates Category Endpoints */
async function checkCategory(req, res, next) {
  const { categoryId } = req.params;
  const { category } = req.body;

  try {
    if (categoryId) {
      const existingCategory = await categoryService.getOneCategory(
        "CategoryId",
        categoryId
      );
      if (!existingCategory) {
        return errorMessage(
          res,
          "Category not found. Please use a valid category ID."
        );
      }

      /* Validation for DELETE */
      if (req.method === "DELETE") {
        const categoryInUse = await categoryService.categoryInUse(categoryId);
        if (categoryInUse) {
          return errorMessage(res, "Category is in use and cannot be deleted.");
        }
      }
    }

    /* Validation for POST and PUT */
    if (req.method === "POST" || req.method === "PUT") {
      if (!category) {
        return errorMessage(res, "Please provide a category.");
      }

      if (!/^[a-zA-Z\s_]+$/.test(category)) {
        return errorMessage(
          res,
          "Please only use letters in the category name."
        );
      }

      const duplicateCategory = await categoryService.getOneCategory(
        "Category",
        category
      );
      if (duplicateCategory) {
        return errorMessage(
          res,
          "Category already exists. Please choose a different name."
        );
      }
    }
    next();
  } catch (error) {
    return errorMessage(res, "Could not validate category.");
  }
}

module.exports = checkCategory;
