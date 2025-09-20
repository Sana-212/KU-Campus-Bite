require("dotenv").config();

const express = require("express");
const app = express();

const menuRouter = require("./src/routes/menuRouter");
const canteenRouter = require("./src/routes/canteenRouter");
const cartRouter = require("./src/routes/cartRouter");
const authRouter = require("./src/routes/authRouter");
const checkoutRouter = require("./src/routes/checkoutRouter");
const dashboardOrderRouter = require("./src/routes/dashboardOrderRouter");
const dashboardCanteenRouter = require("./src/routes/dashboardCanteenRouter");
const dashboardRouter = require("./src/routes/dashboardRouter");
const dashboardReportRouter = require("./src/routes/dashboardReportRouter");


app.use(express.json());

//Home Page Route
app.get("/", (req, res) => {
  res.send(
    '<and>Display <a href="/api/menu">Menu</a> and <a href="/api/canteen">Canteen</a> </h1>'
  );
});

//Menu Api Route
app.use("/api/menu", menuRouter);
app.use("/api/canteen", canteenRouter);
app.use("/api/cart", cartRouter);
app.use("/api/auth", authRouter);
app.use("/api", checkoutRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/dashboard/Order", dashboardOrderRouter);
app.use("/api/dashboard/Canteen", dashboardCanteenRouter);
app.use("/api/dashboard/Report", dashboardReportRouter);

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
