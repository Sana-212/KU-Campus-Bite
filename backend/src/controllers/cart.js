const Cart = require("../models/cart");
const Menu = require("../models/foodMenu");
const { v4: uuidv4 } = require("uuid");

// will generate guestId in frontend
// const createGuestId = (req, res) => {
//   const guestId = uuidv4();
//   res.json({ guestId });
// };

const addToCart = async (req, res) => {
  try {
    const { userId, guestId, menuItemId, quantity } = req.body;

    if (!userId && !guestId) {
      return res.status(400).json({ msg: "Provide userId or guestId" });
    }

    if (!menuItemId) {
      return res.status(400).json({ msg: "menuItemId is required" });
    }

    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ msg: "Menu item not found" });
    }

    let cart = null;

    if (userId) {
      cart = await Cart.findOne({ userId });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      cart = new Cart({
        userId: userId || null,
        guestId: guestId || null,
        items: [],
      });
    }

    const existingItem = cart.items.find((item) => {
      return item.menuItemId.toString() === menuItemId;
    });

    const qtyNum = Number(quantity) || 1;

    if (existingItem) {
      existingItem.quantity += qtyNum;
    } else {
      cart.items.push({
        menuItemId:menuItem._id,
        quantity: qtyNum,
        price: menuItem.price,
        name: menuItem.name,
      });
    }

    await cart.save();
    return res.json({ cart });
  } catch (error) {
    return res.status(500).json({ msg: "Error adding to cart", error });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId, guestId } = req.query;

    let cart = null;

    if (userId) {
      cart = await Cart.findOne({ userId }).populate(
        "items.menuItemId",
        "name image category price "
      );
    } else if (guestId) {
      cart = await Cart.findOne({ guestId }).populate(
        "items.menuItemId",
        "name image category price "
      );
    }

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, msg: "Cart Item not found " });
    }

    return res.status(200).json({ success: true, cart: cart.items });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { userId, guestId } = req.query;
    const { menuItemId, quantity } = req.body;

    const query = userId ? { userId } : { guestId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, msg: "Cart Item not found " });
    }

    const itemIndex = cart.items.findIndex((item) => {
      return item.menuItemId.toString() === menuItemId;
    });

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, msg: "Item not found in Cart " });
    }

    const qtyNum = Number(quantity);

    if (qtyNum <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = qtyNum;
    }
    await cart.save();
    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { userId, guestId } = req.query;
    const { menuItemId } = req.body;

    const query = userId ? { userId } : { guestId };
    const cart = await Cart.findOneAndUpdate(
      query, // find the right cart
      { $pull: { items: { menuItemId } } }, // remove the item from items array
      { new: true } // return updated cart
    );

    if (!cart) {
      return res.status(404).json({ success: false, msg: "Cart not found " });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId, guestId } = req.query;

    const query = userId ? { userId } : { guestId };

    let cart;

    if (guestId && !userId) {
      const deletedCart = await Cart.findOneAndDelete(query);
      if (!deletedCart) {
        return res.status(404).json({ success: false, msg: "Cart not found" });
      }
      return res
        .status(200)
        .json({ success: true, msg: "Cart cleared", cart: { items: [] } });
    } else {
      cart = await Cart.findOneAndUpdate(
        query,
        { $set: { items: [] } }, // empty the items array
        { new: true } // return updated cart
      );
    }

    if (!cart) {
      return res.status(404).json({ success: false, msg: "Cart not found" });
    }
    return res.status(200).json({ success: true, msg: "Cart cleared", cart });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeItemFromCart,
  clearCart,
};
