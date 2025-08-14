require('dotenv').config();

const express = require("express");
const app = express();

const menuRouter = require('./src/routes/menuRouter')

app.use(express.json());

//Home Page Route
app.get('/',(req,res)=>{
  res.send('<h1>Display Menu <a href="/api/menu">Menu</a></h1>')
})

//Menu Api Route
app.use('/api/menu',menuRouter)


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
