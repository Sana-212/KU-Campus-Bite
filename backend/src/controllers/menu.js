// controllers/menu.js
const Menu = require("../models/foodMenu");

const getAllMenu = async (req, res) => {
  try {
    let queryObject = {};

    // Searching query
    if (req.query.search) {
      queryObject.name = { $regex: req.query.search, $options: "i" };
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get total count (for pagination)
    const total = await Menu.countDocuments(queryObject);

    // Get page items
    const menuItems = await Menu.find(queryObject)
      .populate("canteenId", "name")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,         
      page,
      limit,
      menuItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = { getAllMenu };
