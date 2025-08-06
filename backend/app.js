require('dotenv').config();

const express = require("express");
const app = express();

const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`DB Connection Successful !! `);
    });
  } catch (error) {
    console.log("DB Connection failed", error);
  }
};

start();
