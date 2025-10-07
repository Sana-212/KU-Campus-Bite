const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  menuItemId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Menu Items",   
  required: true,
},

  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  name:{
    type:String,
    required:true
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  guestId: {
    type: String,
    default: null,
  },
  items: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
