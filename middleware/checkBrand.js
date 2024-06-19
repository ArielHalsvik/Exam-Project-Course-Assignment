var db = require("../models");
var BrandService = require("../services/BrandService");
var brandService = new BrandService(db);
var errorMessage = require("../middleware/errorMessage");

/* Validates Brand Endpoints */
async function checkBrand(req, res, next) {
  const { brandId } = req.params;
  const { brand } = req.body;

  try {
    if (brandId) {
      const existingBrand = await brandService.getOneBrand("BrandId", brandId);
      if (!existingBrand) {
        return errorMessage(
          res,
          "Brand not found. Please use a valid brand ID."
        );
      }

      /* Validation for DELETE*/
      if (req.method === "DELETE") {
        const brandInUse = await brandService.brandInUse(brandId);
        if (brandInUse) {
          return errorMessage(res, "Brand is in use and cannot be deleted.");
        }
      }
    }

    /* Validation for POST and PUT */
    if (req.method === "POST" || req.method === "PUT") {
      if (!brand) {
        return errorMessage(res, "Please provide a brand.");
      }

      if (!/^[a-zA-Z\s_]+$/.test(brand)) {
        return errorMessage(res, "Please only use letters in the brand name.");
      }

      const duplicateBrand = await brandService.getOneBrand("Brand", brand);
      if (duplicateBrand) {
        return errorMessage(
          res,
          "Brand already exists. Please choose a different name."
        );
      }
    }
    next();
  } catch (error) {
    return errorMessage(res, "Could not validate brand.");
  }
}

module.exports = checkBrand;
