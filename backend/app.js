require("dotenv").config();
const cors = require("cors");
const path = require("path");
const express = require("express");
const app = express();

const menuRouter = require("./src/routes/menuRouter");
const canteenRouter = require("./src/routes/canteenRouter");
const cartRouter = require("./src/routes/cartRouter");
const authRouter = require("./src/routes/authRouter");
const checkoutRouter = require("./src/routes/checkoutRouter");
const orderRouter= require("./src/routes/orderRouter");
const dashboardOrderRouter = require("./src/routes/dashboardOrderRouter");
const dashboardCanteenRouter = require("./src/routes/dashboardCanteenRouter");
const dashboardRouter = require("./src/routes/dashboardRouter");
const dashboardReportRouter = require("./src/routes/dashboardReportRouter");


app.use(express.json());
app.use(cors())

app.use('/images', express.static(path.join(__dirname, '..', 'KU-Frontend', 'images')));

//Menu Api Route/
app.use("/api/menu", menuRouter);
app.use("/api/canteen", canteenRouter);
app.use("/api/cart", cartRouter);
app.use("/api/auth", authRouter);
app.use("/api", checkoutRouter);
app.use("/api/orders", orderRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/dashboard/order", dashboardOrderRouter);
app.use("/api/dashboard/canteen", dashboardCanteenRouter);
app.use("/api/dashboard/report", dashboardReportRouter);

const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    console.log("start");
    await connectDB(process.env.MONGO_URI );
    app.listen(PORT, () => {
      console.log(`DB Connection Successful !! ${PORT} `);
    });
  } catch (error) {
    console.log("DB Connection failed", error);
  }
};

start();
