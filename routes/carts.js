var express = require("express");
var router = express.Router();
var db = require("../models");

var CartService = require("../services/CartService");
var cartService = new CartService(db);
var CartItemService = require("../services/CartItemService");
var cartItemService = new CartItemService(db);
var MembershipService = require("../services/MembershipService");
var membershipService = new MembershipService(db);
var OrderService = require("../services/OrderService");
var orderService = new OrderService(db);
var OrderItemService = require("../services/OrderItemService");
var orderItemService = new OrderItemService(db);
var ProductService = require("../services/ProductService");
var productService = new ProductService(db);
var UserService = require("../services/UserService");
var userService = new UserService(db);

var isUser = require("../middleware/isUser");
var isAdmin = require("../middleware/isAdmin");
var errorMessage = require("../middleware/errorMessage");
var successMessage = require("../middleware/successMessage");
var checkCart = require("../middleware/checkCart");
var userDiscount = require("../middleware/userDiscount");

/* Get all Carts Items from Current User's Active Cart */
router.get("/", isUser, checkCart, async (req, res, next) => {
  // #swagger.tags = ['Carts']
  // #swagger.description = 'Gets all user's cart items from the database.'
  // #swagger.responses = [200]
  const cartId = req.cart.activeCartId;

  try {
    const cartItemData = await cartItemService.getAllCartItems(cartId);

    return successMessage(
      res,
      "Cart items found successfully.",
      "cartItems",
      cartItemData
    );
  } catch (error) {
    return errorMessage(res, "Carts could not be fetched.");
  }
});

/* Add a Product to Current User's Active Cart */
router.post("/", isUser, checkCart, async (req, res, next) => {
  // #swagger.tags = ['Carts']
  // #swagger.description = 'Creates a new active cart if the user doesn't have one and adds items.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Cart"
      }
    }
  */
  const { productId, quantity } = req.body;
  const { activeCartId, unitPrice, duplicatedProduct, newQuantity } = req.cart;

  try {
    if (duplicatedProduct) {
      await cartItemService.updateCartItemQuantity(
        activeCartId,
        productId,
        newQuantity
      );

      return successMessage(res, "Product quantity updated successfully.");
    } else {
      await cartItemService.addProductToCart(
        activeCartId,
        productId,
        quantity,
        unitPrice
      );

      return successMessage(res, "Product added to cart successfully.");
    }
  } catch (error) {
    console.error(error);
    return errorMessage(res, "Cart item could not be added.");
  }
});

/* Checkout a Current User's Active Cart */
router.post(
  "/checkout/now",
  isUser,
  checkCart,
  userDiscount,
  async (req, res, next) => {
    // #swagger.tags = ['Carts']
    // #swagger.description = 'Checks out a user's cart.'
    // #swagger.responses = [200]
    /* #swagger.parameters['body'] = {
        "name": "body",
        "in": "body",
        "schema": {
          "$ref": "#/definitions/Cart"
        }
      }
    */

    const { activeCartId, cartItems, orderNumber } = req.cart;
    const userId = req.user.userId;
    const membershipId = req.membershipId;
    const discount = req.discount;

    try {
      // Checks Out Cart
      await cartService.checkOutCart(activeCartId);

      // Creates Order
      const order = await orderService.createOrder(
        userId,
        orderNumber,
        membershipId
      );

      // Creates Order Items
      const orderId = order.OrderId;
      for (const cartItem of cartItems) {
        await orderItemService.createOrderItem(
          orderId,
          cartItem.ProductId,
          cartItem.Quantity,
          cartItem.UnitPrice
        );
        await cartItemService.deleteCartItem(activeCartId, cartItem.ProductId);
      }

      // Updates Product Quantity
      for (const cartItem of cartItems) {
        const product = await productService.getOneProduct(
          "ProductId",
          cartItem.ProductId
        );
        const newQuantity = product.Quantity - cartItem.Quantity;
        await productService.updateProductQuantity(
          cartItem.ProductId,
          newQuantity
        );
      }

      // Calculates Total Price
      const orderItems = await orderItemService.getAllOrderItems(orderId);
      let fullPrice = 0;
      for (const orderItem of orderItems) {
        fullPrice += orderItem.Quantity * orderItem.UnitPrice;
      }

      // Calculates Membership Discount
      const discountedPrice = fullPrice - fullPrice * (discount / 100);

      // Calculates and Upgrades Membership Status
      const purchases = await orderItemService.getAllOrderItemsTotal(userId);
      const getAllMemberships = await membershipService.getAllMemberships();

      for (const membership of getAllMemberships) {
        if (membership.Purchases <= purchases) {
          const newMembershipId = membership.MembershipId;
          await userService.upgradeMembership(userId, newMembershipId);
        }
      }

      return successMessage(
        res,
        "Order created successfully.",
        "sum",
        discountedPrice,
        "order",
        order
      );
    } catch (error) {
      return errorMessage(res, "Order could not be created.");
    }
  }
);

/* Update a Cart Item's Quantity in User's Active Cart */
router.put("/", isUser, checkCart, async (req, res, next) => {
  // #swagger.tags = ['Carts']
  // #swagger.description = 'Updates a specific cart item's quantity in user's cart.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/Cart"
      }
    }
  */
  const { productId, quantity } = req.body;
  const { activeCartId } = req.cart;

  try {
    await cartItemService.updateCartItemQuantity(
      activeCartId,
      productId,
      quantity
    );

    return successMessage(
      res,
      "Cart item quantity updated successfully.",
      "productId",
      productId,
      "quantity",
      quantity
    );
  } catch (error) {
    return errorMessage(res, "Cart could not be updated.");
  }
});

/* Delete a Specific Cart Item in a User's Active Cart */
router.delete("/", isUser, checkCart, async (req, res, next) => {
  // #swagger.tags = ['Carts']
  // #swagger.description = 'Deletes a specific item in a user's active cart.'
  // #swagger.responses = [200]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
        "$ref": "#/definitions/CartDelete"
      }
    }
  */
  const { activeCartId } = req.cart;
  const productId = req.body.productId;

  try {
    await cartItemService.deleteCartItem(activeCartId, productId);

    return successMessage(res, "Cart item removed successfully from the cart.");
  } catch (error) {
    return errorMessage(res, "Cart item could not be removed from the cart.");
  }
});

/* Delete a Specific Cart */
router.delete("/:cartId", isAdmin, checkCart, async (req, res, next) => {
  // #swagger.tags = ['Carts']
  // #swagger.description = 'Deletes a specific cart.'
  // #swagger.responses = [200]
  const cartId = req.params.cartId;

  try {
    await cartService.deleteCart(cartId);

    return successMessage(res, "Cart removed successfully from the database.");
  } catch (error) {
    return errorMessage(res, "Cart could not be removed from the database.");
  }
});

module.exports = router;
