require("dotenv").config();
const connectDB = require("../config/db.js");

const Canteen = require("../models/canteen.js");
const Menu = require("../models/foodMenu.js");

const canteenData = require("./canteenData.js");
const menuData = require("./menuData.js");

const seedData = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("DB connected");

    await Canteen.deleteMany();
    await Menu.deleteMany();

    // Insert canteens
    const insertedCanteens = await Canteen.insertMany(canteenData);

    // Map canteen name → ID
    const canteenMap = {};

    insertedCanteens.forEach((c) => {
      canteenMap[c.name] = c._id;
    });

    // Replace canteenName with canteenId in menu
    const menuWithIds = menuData.map((menu) => ({
      ...menu,
      canteenId: canteenMap[menu.canteenName],
    }));

    //Insert menus
    await Menu.insertMany(menuWithIds);

    console.log("Data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.log("error seeding data ", error);
    process.exit(1);
  }
};

seedData();
