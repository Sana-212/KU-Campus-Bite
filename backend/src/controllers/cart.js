const Cart = require("../models/cart");
const Menu = require("../models/foodMenu");
const mongoose = require("mongoose");
// ================== Add to Cart ==================
const addToCart = async (req, res) => {
  try {
    const { userId, guestId, menuItemId, quantity } = req.body;

    if (!userId && !guestId) {
      return res.status(400).json({ success: false, msg: "Provide userId or guestId" });
    }
    if (!menuItemId) {
      return res.status(400).json({ success: false, msg: "menuItemId is required" });
    }

    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ success: false, msg: "Menu item not found" });
    }

    let cart = userId
      ? await Cart.findOne({ userId })
      : await Cart.findOne({ guestId });

    if (!cart) {
      cart = new Cart({
        userId: userId || null,
        guestId: guestId || null,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.menuItemId.toString() === menuItemId
    );

    const qtyNum = Number(quantity) || 1;

    if (existingItem) {
      existingItem.quantity += qtyNum;
    } else {
      cart.items.push({
        menuItemId: menuItem._id,
        quantity: qtyNum,
        price: menuItem.price,
        name: menuItem.name,
      });
    }

    await cart.save();
    return res.json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, msg: "Error adding to cart", error });
  }
};

// ================== Get Cart ==================
const getCart = async (req, res) => {
  try {
    const { userId, guestId } = req.query;

    let cart = userId
      ? await Cart.findOne({ userId }).populate("items.menuItemId", "name image category price")
      : await Cart.findOne({ guestId }).populate("items.menuItemId", "name image category price");

    if (!cart) {
      return res.status(200).json({ success: true, cart: [] });
    }

    return res.status(200).json({ success: true, cart: cart.items });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

// ===== Update Cart =====
const updateCart = async (req, res) => {
  try {
    const { userId, guestId, itemId, action } = req.body;

    const query = userId ? { userId } : { guestId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ success: false, msg: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, msg: "Item not found in cart" });
    }

    // --- Handle actions from frontend ---
    if (action === "increase") {
      cart.items[itemIndex].quantity += 1;
    } else if (action === "decrease") {
      cart.items[itemIndex].quantity -= 1;
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1); // remove if qty goes 0
      }
    } else if (action === "remove") {
      cart.items.splice(itemIndex, 1); // ✅ remove button logic
    } else {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid action provided" });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};





// ================== Remove Item from Cart ==================
// const removeItemFromCart = async (req, res) => {
//   try {
//     const { userId, guestId, itemId } = req.body;

//     const query = userId ? { userId } : { guestId };
//     const cart = await Cart.findOne(query);

//     if (!cart) {
//       return res.status(404).json({ success: false, msg: "Cart not found" });
//     }

//     cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
//     await cart.save();

//     return res.status(200).json({ success: true, cart: cart.items });
//   } catch (error) {
//     return res.status(500).json({ success: false, msg: error.message });
//   }
// };

// ================== Remove Item from Cart ==================
// const removeItemFromCart = async (req, res) => {
//   try {
//     const { userId, guestId, menuItemId } = req.body;

//     const query = userId ? { userId } : { guestId };
//     const cart = await Cart.findOne(query);

//     if (!cart) {
//       return res.status(404).json({ success: false, msg: "Cart not found" });
//     }

//     // remove based on menuItemId instead of cart item _id
//     cart.items = cart.items.filter(
//       (i) => i._id.toString() !== menuItemId);
//     //   (i) => i.menuItemId.toString() !== menuItemId
//     // );

//     await cart.save();
//     return res.status(200).json({ success: true, cart: cart.items });
//   } catch (error) {
//     return res.status(500).json({ success: false, msg: error.message });
//   }
// };


const removeItemFromCart = async (req, res) => {
  try {
    let { userId, guestId, menuItemId } = req.body;

    const query = userId 
      ? { userId: new mongoose.Types.ObjectId(userId) } 
      : { guestId };

    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ success: false, msg: "Cart not found" });
    }

    // log before removal for debugging
    console.log("Before removal:", cart.items.map(i => i.menuItemId.toString()));

    cart.items = cart.items.filter(
      (i) => i.menuItemId.toString() !== menuItemId
    );

    await cart.save();

    console.log("After removal:", cart.items.map(i => i.menuItemId.toString()));

    return res.status(200).json({ success: true, cart: cart.items });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};



// ================== Clear Cart ==================
const clearCart = async (req, res) => {
  try {
    const { userId, guestId } = req.query; // ✅ use query

    if (!userId && !guestId) {
      return res.status(400).json({ success: false, msg: "userId or guestId must be provided" });
    }

    const query = userId ? { userId } : { guestId };

    let cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ success: false, msg: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({ success: true, msg: "Cart cleared", cart: [] });
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

