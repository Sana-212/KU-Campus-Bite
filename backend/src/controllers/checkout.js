const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const Cart = require("../models/cart");

const checkout = async (req, res) => {
  try {
    const userId = req.user.id; // comes from JWT payload
    const {deliveryAddress }= req.body;

     if (!deliveryAddress) {
            return res.status(400).json({ success: false, msg: "Delivery address is required." });
        }

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "Your cart is empty" });
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const order = new Order({
      userId,
      items: cart.items,
      totalAmount,
      status: "pending",
      paymentMethod: "cash",
      deliveryAddress
    });

    await order.save();

    return res
      .status(200)
      .json({
        success: true,
        msg: "Checkout successful , Order placed",
        order,
      });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {checkout};
