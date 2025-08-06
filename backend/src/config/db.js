const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose.connect(url, {
    family: 4,  // Force IPv4 to avoid DNS issues
  });
};

module.exports = connectDB;
