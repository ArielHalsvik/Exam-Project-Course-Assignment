var db = require("../models");
var CartService = require("../services/CartService");
var cartService = new CartService(db);
var CartItemService = require("../services/CartItemService");
var cartItemService = new CartItemService(db);
var ProductService = require("../services/ProductService");
var productService = new ProductService(db);
var errorMessage = require("../middleware/errorMessage");

/* Checks if Product Quantity Exceeds Product Stock */
function checkProductQuantity(product, quantity) {
  const productQuantity = product.Quantity;
  const productName = product.Name;

  if (productQuantity === null) {
    throw new Error("Product quantity not found.");
  }

  if (quantity > productQuantity) {
    throw new Error(
      `Quantity exceeds product stock. Quantity in stock for '${productName}': '${productQuantity}'. Quantity in cart: '${quantity}'.`
    );
  }

  if (quantity < 1) {
    throw new Error("Quantity must be at least 1.");
  }
}

/* Validation for Cart Endpoints */
async function checkCart(req, res, next) {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;
  const cartId = req.params.cartId;

  try {
    /* Validation for DELETE /:cartId */
    if (req.method === "DELETE" && req.url === `/${cartId}`) {
      const existingCart = await cartService.getCart("cartId", cartId);
      if (existingCart && existingCart.Status == "Active") {
        return errorMessage(res, "Cart can not be deleted when still active.");
      } else if (!existingCart) {
        return errorMessage(res, "Cart not found.");
      }

      return next();
    }

    /* Finds User's Active Cart */
    let activeCart = await cartService.getCart("userId", userId);
    if (!activeCart && req.method === "POST" && req.url === "/") {
      activeCart = await cartService.createCart(userId);
    } else if (!activeCart) {
      return errorMessage(res, "No active cart found.");
    }

    const activeCartId = activeCart.CartId;
    req.cart = { activeCartId };

    /* Validation for POST and PUT */
    if ((req.method === "POST" && req.url === "/") || req.method === "PUT") {
      if (!productId || !quantity) {
        return errorMessage(
          res,
          "Please provide a productId and a quantity to add a cart item."
        );
      }

      if (isNaN(quantity)) {
        return errorMessage(res, "Please provide a valid quantity.");
      }

      const product = await productService.getOneProduct(
        "ProductId",
        productId
      );
      if (!product) {
        return errorMessage(
          res,
          "Product not found. Please provide a valid productId."
        );
      }

      if (req.method === "POST") {
        const unitPrice = product.UnitPrice;
        if (!unitPrice) {
          return errorMessage(res, "Unit price not found.");
        }
        req.cart.unitPrice = unitPrice;

        const duplicatedProduct = await cartItemService.getOneCartItem(
          activeCartId,
          productId
        );
        if (duplicatedProduct) {
          const productQuantityInCart = duplicatedProduct.Quantity;
          const newQuantity = productQuantityInCart + quantity;
          checkProductQuantity(product, newQuantity);

          req.cart.duplicatedProduct = duplicatedProduct;
          req.cart.newQuantity = newQuantity;
        }

        checkProductQuantity(product, quantity);

      } else {
        const existingCartItem = await cartItemService.getOneCartItem(
          activeCartId,
          productId
        );

        if (!existingCartItem) {
          return errorMessage(
            res,
            "Cart item not found in user's active cart."
          );
        }

        checkProductQuantity(product, quantity);
      }

      return next();
    }

    /* Validation for POST /checkout/now */
    if (req.method === "POST" && req.url === "/checkout/now") {
      const cartItems = await cartItemService.getAllCartItems(activeCartId);

      for (const cartItem of cartItems) {
        const product = await productService.getOneProduct(
          "ProductId",
          cartItem.ProductId
        );
        checkProductQuantity(product, cartItem.Quantity);
      }
      req.cart.cartItems = cartItems;

      function generateOrderNumber() {
        const characters =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let orderNumber = "";
        for (let i = 0; i < 8; i++) {
          orderNumber += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        return orderNumber;
      }
      const orderNumber = generateOrderNumber();
      req.cart.orderNumber = orderNumber;

      return next();
    }

    /* Validation for DELETE */
    if (req.method === "DELETE") {
      if (!productId) {
        return errorMessage(res, "Please provide a productId to remove.");
      }

      const existingCartItem = await cartItemService.getOneCartItem(
        activeCartId,
        productId
      );
      if (!existingCartItem) {
        return errorMessage(res, "Cart item not found in user's active cart.");
      }

      return next();
    }

    next();
  } catch (error) {
    return errorMessage(res, error.message);
  }
}

module.exports = checkCart;
