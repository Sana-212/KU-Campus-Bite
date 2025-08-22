const mongoose = require("mongoose");
const slugify = require("slugify");

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
  },
  image: {
    type: String,
    default: "",
  },
  slug:{
    type:String,
    unique:true
  }
});

canteenSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Canteen", canteenSchema);
