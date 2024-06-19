var db = require("../models");
var ProductService = require("../services/ProductService");
var productService = new ProductService(db);
var CategoryService = require("../services/CategoryService");
var categoryService = new CategoryService(db);
var BrandService = require("../services/BrandService");
var brandService = new BrandService(db);

var errorMessage = require("../middleware/errorMessage");
var validateProduct = require("../middleware/validateProduct");

/* Validation for CategoryId and BrandId */
async function checkBrandAndCategory(categoryId, brandId) {
  const existingCategory = await categoryService.getOneCategory(
    "CategoryId",
    categoryId
  );
  if (!existingCategory) {
    throw new Error("Invalid categoryId, please use a valid category ID.");
  }

  const existingBrand = await brandService.getOneBrand("BrandId", brandId);
  if (!existingBrand) {
    throw new Error("Invalid brandId, please use a valid brand ID.");
  }

  return true;
}

/* Validation for Product Endpoints */
async function checkProduct(req, res, next) {
  const { productId } = req.params;
  const {
    name,
    description,
    imgUrl,
    unitPrice,
    quantity,
    categoryId,
    brandId,
  } = req.body;

  /* Checks if Product ID exists */
  try {
    if (productId) {
      const existingProduct = await productService.getOneProduct(
        "ProductId",
        productId
      );
      if (!existingProduct) {
        return errorMessage(
          res,
          "Product not found. Please use a valid product ID."
        );
      }

      /* Validation for DELETE */
      if (req.method === "DELETE") {
        const isProductDeleted = await productService.isProductDeleted(
          productId
        );
        if (isProductDeleted) {
          return errorMessage(res, "Product is already deleted.");
        }
        next();
      }
    }

    /* Validation for POST */
    if (req.method === "POST") {
      try {
        validateProduct(
          name,
          description,
          imgUrl,
          unitPrice,
          quantity,
          categoryId,
          brandId,
          0,
          false
        );
        await checkBrandAndCategory(categoryId, brandId);

        const duplicateProduct = await productService.getOneProduct(
          "Name",
          name
        );
        if (duplicateProduct) {
          return errorMessage(
            res,
            "Product already exists. Please choose a different name."
          );
        }

        next();
      } catch (error) {
        return errorMessage(res, error.message);
      }
    }

    /* Validation for PUT */
    if (req.method === "PUT") {
      const isDeleted = req.body.isDeleted;

      try {
        validateProduct(
          name,
          description,
          imgUrl,
          unitPrice,
          quantity,
          categoryId,
          brandId,
          isDeleted,
          true
        );

        await checkBrandAndCategory(categoryId, brandId);

        const duplicateProduct = await productService.getOneProduct(
          "Name",
          name
        );
        if (
          duplicateProduct &&
          duplicateProduct.ProductId !== parseInt(productId)
        ) {
          return errorMessage(
            res,
            "Product already exists. Please choose a different name."
          );
        }
        next();
      } catch (error) {
        return errorMessage(res, error.message);
      }
    }
  } catch (error) {
    return errorMessage(res, "Could not validate product.");
  }
}

module.exports = checkProduct;
