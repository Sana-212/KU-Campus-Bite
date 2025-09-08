const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  // canteenId:{
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref:"Canteen",
  //   required:[true,"Canteen ID must be provided"],
  // },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: [true, "Student ID must be provided"],
  },
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu Items",
        required: [true, "Menu item ID must be provided"],
      },
      price: {
        type: Number,
        required: [true, "Menu item price must be provided"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity must be provided"],
        min: [1, "Quantity cannot be less than 1"],
      },
      name: {
        type: String,
        required: [true, "Menu item name must be provided"],
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: [true, "Total amount must be provided"],
  },
  status: {
    type: String,
    enum: ["pending", "preparing", "delivered", "cancelled"],
    default: "pending",
  },
  placedAt: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    default: "cash",
  },
  deliveryAddress: {
    type: String,
    required: [true, "Delivery address must be provided"],
  },
});
module.exports = mongoose.model("Order", orderSchema);
