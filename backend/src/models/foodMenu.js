const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "food item name must be provided "],
  },
  price: {
    type: Number,
    required: [true, "price of food item must be provided"],
  },
  canteenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Canteen",
    // required: [true,'Canteen name must be provided']
  },
  available: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    enum: ["lunch", "breakfast", "dessert", "snacks", "bbq","drinks"],
    default: "lunch",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Menu Items", menuSchema);
