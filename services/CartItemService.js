class CartItemService {
  constructor(db) {
    this.client = db.sequelize;
    this.CartItem = db.CartItem;
  }

  /* Gets all Cart Items from a Specific Cart */
  async getAllCartItems(cartId) {
    try {
      return this.CartItem.findAll({
        where: { CartId: cartId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Gets one Cart Item from a Specific Cart */
  async getOneCartItem(cartId, productId) {
    try {
      return this.CartItem.findOne({
        where: { CartId: cartId, ProductId: productId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Adds a New Product to the Cart Items Table */
  async addProductToCart(cartId, productId, quantity, unitPrice) {
    try {
      return this.CartItem.create({
        CartId: cartId,
        ProductId: productId,
        Quantity: quantity,
        UnitPrice: unitPrice,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Updates Quantity of a Product */
  async updateCartItemQuantity(cartId, productId, quantity) {
    try {
      return this.CartItem.update(
        { Quantity: quantity },
        { where: { CartId: cartId, ProductId: productId } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* Deletes a Product from a Cart */
  async deleteCartItem(cartId, productId) {
    try {
      return this.CartItem.destroy({
        where: { CartId: cartId, ProductId: productId },
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = CartItemService;
