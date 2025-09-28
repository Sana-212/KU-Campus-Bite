const Order = require("../models/order");

const getReportData = async (req, res) => {
  try {
    const duration = req.query.duration ? parseInt(req.query.duration, 10) : 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - duration);
    startDate.setHours(0,0,0,0);

    const [totalOrdersAndRevenue, ordersAndRevenueByCanteen] =
      await Promise.all([
        Order.aggregate([
          {
            $match: {
              placedAt: { $gte: startDate },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
              totalOrders: { $sum: 1 },
            },
          },
        ]),
        Order.aggregate([
          {
            $match: {
              placedAt: { $gte: startDate },
            },
          },
          { $unwind: "$items" },
          {
            $lookup: {
              from: "menu items",
              localField: "items.menuItemId",
              foreignField: "_id",
              as: "menuItem",
            },
          },
          { $unwind: "$menuItem" },
          {
            $lookup: {
              from: "canteens",
              localField: "menuItem.canteenId",
              foreignField: "_id",
              as: "canteen",
            },
          },
          { $unwind: "$canteen" },
          {
            $group: {
              _id: "$canteen._id",
              canteenName: { $first: "$canteen.name" },
              totalRevenue: {
                $sum: { $multiply: ["$items.price", "$items.quantity"] },
              },
              uniqueOrders: { $addToSet: "$_id" },
            },
          },
        ]),
      ]);

     ordersAndRevenueByCanteen.sort((a,b) => b.totalRevenue-a.totalRevenue);

     const topCanteen = ordersAndRevenueByCanteen[0] || null;

    const finalData = {
      totalRevenue: totalOrdersAndRevenue[0]?.totalRevenue || 0,
      totalOrders: totalOrdersAndRevenue[0]?.totalOrders || 0,
      canteenSalesOverview:ordersAndRevenueByCanteen.map(canteen=>({
        canteenName:canteen.canteenName,
        totalRevenue:canteen.totalRevenue,
        totalOrders:canteen.uniqueOrders.length
      })),
      topCanteenName:topCanteen?.canteenName ||"N/A",
      topCanteenRevenue:topCanteen?.totalRevenue ||0,
      topCanteenOrders:topCanteen?.uniqueOrders?.length ||0,
      
    };

    return res.status(200).json({ success: true, finalData });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports={getReportData};
