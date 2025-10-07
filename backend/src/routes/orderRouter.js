const express = require("express");
const router = express.Router();
const Order = require("../models/order"); 
const authMiddleware = require("../middleware/authMiddleware"); 

const { checkout } = require("../controllers/checkout"); 

router.post("/", authMiddleware, checkout);

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