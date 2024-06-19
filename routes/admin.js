var express = require("express");
var router = express.Router();
var db = require("../models");

var ProductService = require("../services/ProductService");
var productService = new ProductService(db);
var CategoryService = require("../services/CategoryService");
var categoryService = new CategoryService(db);
var BrandService = require("../services/BrandService");
var brandService = new BrandService(db);
var MembershipService = require("../services/MembershipService");
var membershipService = new MembershipService(db);
var RoleService = require("../services/RoleService");
var roleService = new RoleService(db);
var OrderService = require("../services/OrderService");
var orderService = new OrderService(db);
var UserService = require("../services/UserService");
var userService = new UserService(db);
var StatusService = require("../services/StatusService");
var statusService = new StatusService(db);

var isAdmin = require("../middleware/isAdmin");
var errorMessage = require("../middleware/errorMessage");
var successMessage = require("../middleware/successMessage");
const userDiscount = require("../middleware/userDiscount");

/* Gets Product Page. */
router.get("/products", isAdmin, userDiscount, async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Gets products page for admin.'
  // #swagger.responses = [200]
  try {
    const discount = req.discount;
    let products = await productService.getAllProducts(discount);
    const categories = await categoryService.getAllCategories();
    const brands = await brandService.getAllBrands();

    const { name, category, brand } = req.query;
    if (name || category || brand) {
      products = await productService.searchProducts(
        name,
        category,
        brand,
        discount
      );
    }

    res.render("products", {
      products: products,
      categories: categories,
      brands: brands,
      loggedInUser: req.user.firstName,
    });
  } catch (error) {
    console.error(error);
    return errorMessage(res, "Could not load products.");
  }
});

/* Gets Brands Page. */
router.get("/brands", isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Gets brands page for admin.'
  // #swagger.responses = [200]
  try {
    const brands = await brandService.getAllBrands();

    res.render("brands", { brands: brands, loggedInUser: req.user.firstName });
  } catch (error) {
    console.error(error);
    return errorMessage(res, "Could not load brands.");
  }
});

/* Gets Categories Page. */
router.get("/categories", isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Gets categories page for admin.'
  // #swagger.responses = [200]
  try {
    const categories = await categoryService.getAllCategories();

    res.render("categories", {
      categories: categories,
      loggedInUser: req.user.firstName,
    });
  } catch (error) {
    console.error(error);
    return errorMessage(res, "Could not load categories.");
  }
});

/* Gets Roles Page. */
router.get("/roles", isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Gets roles page for admin.'
  // #swagger.responses = [200]
  try {
    const roles = await roleService.getAllRoles();

    res.render("roles", { roles: roles, loggedInUser: req.user.firstName });
  } catch (error) {
    console.error(error);
    return errorMessage(res, "Could not load roles.");
  }
});

/* Gets Users Page. */
router.get("/users", isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Gets users page for admin.'
  // #swagger.responses = [200]
  try {
    const users = await userService.getAllUsers();
    const roles = await roleService.getAllRoles();

    res.render("users", {
      users: users,
      roles: roles,
      loggedInUser: req.user.firstName,
    });
  } catch (error) {
    console.error(error);
    return errorMessage(res, "Could not load users.");
  }
});

/* Gets Orders Page. */
router.get("/orders", isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Gets orders page for admin.'
  // #swagger.responses = [200]
  try {
    const orders = await orderService.getAllOrders();
    const statuses = await statusService.getAllStatuses();

    res.render("orders", {
      orders: orders,
      statuses: statuses,
      loggedInUser: req.user.firstName,
    });
  } catch (error) {
    console.error(error);
    return errorMessage(res, "Could not load orders.");
  }
});

/* Gets Login Page. */
router.get("/login", function (req, res, next) {
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Logs out a user and gets the login page for admin.'
  // #swagger.responses = [200]
  try {
    res.clearCookie("token");
    res.render("login");

    return successMessage(res, "User logged out successfully.");
  } catch (error) {
    console.error(error);
    return errorMessage(res, "Could not load products.");
  }
});

module.exports = router;
