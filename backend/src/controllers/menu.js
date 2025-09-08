const Menu = require("../models/foodMenu");

const getAllMenu = async (req, res) => {
  try {
    let queryObject = {};

    //Searching query
    if (req.query.search) {
      queryObject.name = { $regex: req.query.search, $options: "i" };
    }

    //Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //Counting total items and pages
    const total = await Menu.countDocuments(queryObject);
    const totalPages = Math.ceil(total / limit);

    //Shuffling items
    const menuItems = await Menu.aggregate([
      { $match: queryObject },
      { $sample: { size: total } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return res
      .status(200)
      .json({ success: true, menuItems, total, totalPages, currentPage: page });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const getSingleMenuItem = async (req, res) => {
  try {
    const { slug } = req.params;
    const menuItem = await Menu.findOne({ slug }).populate("canteenId", "name");

    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, msg: "Menu Item Not Found" });
    }

    return res.status(200).json({ success: true, menuItem });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = { getAllMenu, getSingleMenuItem };
