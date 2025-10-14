const Order = require("../models/order");

const getAllOrders = async (req, res) => {
  try {
    let queryObject = {};

    if (req.query.search) {
      queryObject.userName = { $regex: req.query.search, $options: "i" };
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments(queryObject);
    const totalPages = Math.ceil(total / limit);

    const orders = await Order.find(queryObject)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ success: true, orders,page,limit,totalPages, totalOrders: total});
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllOrders };
