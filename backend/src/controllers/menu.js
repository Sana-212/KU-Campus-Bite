// controllers/menu.js
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
      {
        $lookup: {
          from: 'canteens', 
          localField: 'canteenId',
          foreignField: '_id',
          as: 'canteenDetails',
        },
      },
      {
        $unwind: '$canteenDetails',
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          canteenId: 1,
          price: 1,
          available: 1,
          image: 1,
          category: 1,
           canteenName: '$canteenDetails.name', 
          canteenSlug: '$canteenDetails.slug',
        },
      },
    ]);

    return res
      .status(200)
      .json({ success: true, menuItems, total, totalPages, currentPage: page });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};


module.exports = { getAllMenu };
