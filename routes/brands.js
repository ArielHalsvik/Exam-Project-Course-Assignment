var express = require("express");
var router = express.Router();
var db = require("../models");
var BrandService = require("../services/BrandService");
var brandService = new BrandService(db);

var isAdmin = require("../middleware/isAdmin");
var errorMessage = require("../middleware/errorMessage");
var successMessage = require("../middleware/successMessage");
var checkBrand = require("../middleware/checkBrand");

/* Get all Brands */
router.get("/", checkBrand, async (req, res, next) => {
  // #swagger.tags = ['Brands']
  // #swagger.description = 'Gets all brands from the database.'
  // #swagger.responses = [200]
  try {
    const brandData = await brandService.getAllBrands();

    return successMessage(
      res,
      "Brands found successfully.",
      "brands",
      brandData
    );
  } catch (error) {
    return errorMessage(res, "Brands could not be fetched.");
  }
});

/* Create a Brand */
router.post("/", isAdmin, checkBrand, async (req, res, next) => {
  // #swagger.tags = ['Brands']
  // #swagger.description = 'Creates a new brand.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Brand"
      }
    }
  */
  const { brand } = req.body;

  try {
    const brandData = await brandService.createBrand(brand);

    return successMessage(
      res,
      "Brand created successfully.",
      "brand",
      brandData
    );
  } catch (error) {
    return errorMessage(res, "Brand could not be created.");
  }
});

/* Change a Brand */
router.put("/:brandId", isAdmin, checkBrand, async (req, res, next) => {
  // #swagger.tags = ['Brands']
  // #swagger.description = 'Updates a specific brand.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Brand"
      }
    }
  */
  const { brandId } = req.params;
  const { brand } = req.body;

  try {
    await brandService.updateBrand(brandId, brand);

    return successMessage(res, "Brand updated successfully.", "brand", brand);
  } catch (error) {
    return errorMessage(res, "Brand could not be updated.");
  }
});

/* Delete a Brand */
router.delete("/:brandId", isAdmin, checkBrand, async (req, res, next) => {
  // #swagger.tags = ['Brands']
  // #swagger.description = 'Deletes a specific brand.'
  // #swagger.responses = [200]
  const { brandId } = req.params;

  try {
    await brandService.deleteBrand(brandId);

    return successMessage(res, "Brand deleted successfully.");
  } catch (error) {
    return errorMessage(res, "Brand could not be deleted.");
  }
});

module.exports = router;
