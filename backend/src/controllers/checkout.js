const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const Cart = require("../models/cart");

const { sendOrderNotification } = require('../services/whatsappService');


const checkout = async (req, res) => {
  try {
    const userId = req.user.id; // comes from JWT payload
    const {deliveryAddress,userName,deliveryTime }= req.body;

     if (!deliveryAddress) {
            return res.status(400).json({ success: false, msg: "Delivery address is required." });
        }

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "Your cart is empty" });
    }

  
    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const isPreOrder = deliveryTime && deliveryTime !== "ASAP";

    const order = new Order({
      userId,
      userName,
      items: cart.items,
      totalAmount,
      status: "pending",
      paymentMethod: "cash",
      deliveryAddress,
      orderType: isPreOrder ? "preorder" : "standard",
      deliveryTime: deliveryTime || "ASAP",
    });

    await order.save();

     // --- 2. CLEAR THE CART (Crucial Step) ---
        await Cart.deleteOne({ userId });

        // --- 3. SEND ASYNCHRONOUS NOTIFICATION ---
        // Call the service function immediately. We don't 'await' it, 
        // so the HTTP response is sent back quickly, even if the WhatsApp API is slow.
        sendOrderNotification(order, cart.items); 

        return res
            .status(200)
            .json({
                success: true,
      msg: `Checkout successful — Order placed${isPreOrder ? " (Pre-Order)" : ""}`,
                order,
            });
            
  } catch (error) {
      console.error("🔥 Checkout Error Details:", error);
    return res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {checkout};
