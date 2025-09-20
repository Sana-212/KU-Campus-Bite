const Order = require("../models/order");

const getDashboardData = async (req, res) => {
    try{
 const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  last30Days.setHours(0, 0, 0, 0);

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  last7Days.setHours(0, 0, 0, 0);

  const [
    todaysRevenueAndOrders,
    monthlyRevenueAndOrders,
    salesByCategories,
    ordersPerDayChart,
  ] = await Promise.all([
    // 1.Todays Revenue and total orders
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
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
    // 1.Monthly Revenue and monthly orders
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: "$totalAmount" },
          monthlyOrders: { $sum: 1 },
        },
      },
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last30Days },
        },
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "menu items",
          localField: "items.menuItemId",
          foreignField: "_id",
          as: "menuItemDetails",
        },
      },
      { $unwind: "$menuItemDetails" },
      {
        $group: {
          _id: "$menuItemDetails.category",
          totalRevenue: {$sum:{ $multiply:["$items.quantity","$menuItemDetails.price"] }},
        },
      },
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count:{$sum:1}
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]),
  ]);

  const totalMonthlyRevenue = monthlyRevenueAndOrders[0]?.monthlyRevenue || 0;
  const salesByCategoriesWithPercentage = salesByCategories.map((item)=>({
    ...item,
    percentage:totalMonthlyRevenue>0 ? (item.totalRevenue/totalMonthlyRevenue)*100:0,
  }))

  const finalData = {
    todaysRevenue:   todaysRevenueAndOrders[0]?.totalRevenue || 0 ,
    todaysTotalOrders : todaysRevenueAndOrders[0]?.totalOrders || 0,
    monthlyRevenue: totalMonthlyRevenue,
    monthlyOrders:monthlyRevenueAndOrders[0]?.monthlyOrders || 0,
    salesByCategories: salesByCategoriesWithPercentage,
    ordersPerDayChart
  }
  return res.status(200).json({success:true,finalData})

}catch(err){
        return res.status(500).json({success:false,error:err.message});
    }
}
 
module.exports = { getDashboardData }