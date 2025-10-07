const express = require("express");
const router = express.Router();
const Order = require("../models/order"); 
const authMiddleware = require("../middleware/authMiddleware"); 

router.post("/", authMiddleware, async (req, res) => {
  try {
    //const userId = req.user?._id || null; 
     const userId = req.user?._id || req.body.userId || null;
    const {
      guestId,
      guestName,
      guestEmail,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
    } = req.body;

    if ((!userId && !guestId) || !items || items.length === 0 || !totalAmount || !deliveryAddress) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new Order({
      userId: userId || null,
      guestId: guestId || null,
      guestName: guestName || null,
      guestEmail: guestEmail || null,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || "cash",
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Order Save Error:", error);
    res.status(500).json({ success: false, message: "Failed to place order", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("userId").populate("items.menuItemId");
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate("items.menuItemId");
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user orders" });
  }
});

module.exports = router;
