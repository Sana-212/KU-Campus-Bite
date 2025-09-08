const mongoose = require("mongoose");
const slugify = require("slugify");

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
    enum: ["lunch", "breakfast", "dessert", "snacks", "bbq", "drinks"],
    default: "lunch",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
  },
});

menuSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model("Menu Items", menuSchema);
