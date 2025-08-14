const mongoose = require("mongoose");

const canteenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
  },
  location: {
    type: String,
    required: [true, "location must be provided"],
  },
  contactNumber: {
    type: String,
    required: [true, "whatsapp number must be provided "],
  },
  image: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Canteen", canteenSchema);
