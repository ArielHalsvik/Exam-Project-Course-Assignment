class CartService {
  constructor(db) {
    this.client = db.sequelize;
    this.Cart = db.Cart;
  }

  /* Gets a User's Active Cart */
  async getCart(type, value) {
    try {
      if (type === "userId") {
        return this.Cart.findOne({
          where: { UserId: value, status: "Active" },
        });
      } else if (type === "cartId") {
        return this.Cart.findOne({
          where: { CartId: value },
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  /* Creates a New Active Cart */
  async createCart(userId) {
    try {
      return this.Cart.create({
        UserId: userId,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Checks Out a Cart */
  async checkOutCart(cartId) {
    try {
      return this.Cart.update(
        { Status: "Checked Out" },
        { where: { CartId: cartId } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* Deletes a Cart */
  async deleteCart(cartId) {
    try {
      return this.Cart.destroy({
        where: { CartId: cartId },
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = CartService;
