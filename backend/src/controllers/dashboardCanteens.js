const Order = require("../models/order");
const Canteen = require("../models/canteen");
const Menu = require("../models/foodMenu")

const displayCanteensWithOrders = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0,0);

    const results = await Order.aggregate([
      {
        $match: {
          placedAt: { $gte: today },
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
          foreignField:"_id",
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
      {
        $project: {
          canteenName: 1,
          totalRevenue: 1,
          totalOrders: { $size: "$uniqueOrders" },
        },
      },
    ]);

    return res.status(200).json({ success: true, results });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const addCanteen = async (req, res) => {
  try {
    const { name, contactNumber, location } = req.body;

    if (!name || !location || !contactNumber) {
      return res.status(400).json({
        success: false,
        msg: "Canteen name, location and contact number are all required.",
      });
    }

    const canteen = new Canteen({
      name,
      location,
      contactNumber,
    });

    await canteen.save();

    return res.status(200).json({ success: true, canteen });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const updateCanteen = async (req, res) => {
  try {
    const { canteenId } = req.params;
    const { name, location, contactNumber } = req.body;

    if (!canteenId) {
      return res
        .status(400)
        .json({ success: false, msg: "Canteen Id is required" });
    }

    const updates = {};

    if (name) {
      updates.name = name;
    }
    if (location) {
      updates.location = location;
    }
    if (contactNumber) {
      updates.contactNumber = contactNumber;
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, msg: "No fields to update provided" });
    }

    const updatedCanteen = await Canteen.findOneAndUpdate(
      { _id: canteenId },
      { $set: updates },
      { new: true,runValidators:true }
    );
    if (!updatedCanteen) {
      return res.status(404).json({ success: false, msg: "Canteen not found" });
    }

    return res.status(200).json({ success: true, updatedCanteen });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const removeCanteen = async (req, res) => {
  try {
    const { canteenId } = req.params;

    if (!canteenId) {
      return res
        .status(400)
        .json({ success: false, msg: "Canteen Id is required" });
    }
    const removedCanteen = await Canteen.findOneAndDelete({_id:canteenId});

    if (!removedCanteen) {
      return res.status(404).json({ success: false, msg: "Canteen not found" });
    }

    return res.status(200).json({ success: true, removedCanteen });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const displayMenuOfAllCanteens = async (req, res) => {
  try {
    const canteens = await Canteen.find({});

    if (!canteens || canteens.length === 0) {
      return res.status(404).json({ success: false, msg: "No canteens found" });
    }

    const canteensWithMenus = await Promise.all(
      canteens.map(async (canteen) => {
        const menuItems = await Menu.find({ canteenId: canteen._id });
        return {
          ...canteen.toObject(),
          menuItems,
        };
      })
    );

    return res.status(200).json({ success: true, canteensWithMenus });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const addMenuItemInCanteen = async (req, res) => {
  try {
    const { canteenId } = req.params;
    const { name, price, category } = req.body;

    if (!canteenId) {
      return res
        .status(400)
        .json({ success: false, msg: "Canteen Id is required" });
    }

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        msg: "Name, price are required.",
      });
    }

    const menu = new Menu({
      name,
      price,
      canteenId,
      category,
    });

    await menu.save();
    return res.status(200).json({ success: true, menu });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const updateMenuItemFromCanteen = async (req, res) => {
  try {
    const { canteenId, menuItemId } = req.params;
    const { name, price, category, available } = req.body;

    if (!canteenId || !menuItemId) {
      return res.status(400).json({
        success: false,
        msg: "Canteen Id and Menu item id is required",
      });
    }

    const updates = {};

    if (name) {
      updates.name = name;
    }
    if (price) {
      updates.price = price;
    }
    if (available) {
      updates.available = available;
    }
    if (category) {
      updates.category = category;
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, msg: "No fields to update provided" });
    }

    const updatedMenuItem = await Menu.findOneAndUpdate(
      { _id: menuItemId,canteenId },
      { $set: updates },
      { new: true ,runValidators: true}
    );
    if (!updatedMenuItem) {
      return res
        .status(404)
        .json({ success: false, msg: "Menu Item not found" });
    }

    return res.status(200).json({ success: true, updatedMenuItem });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const removeMenuItemFromCanteen = async (req, res) => {
  try {
    const { canteenId, menuItemId } = req.params;

    if (!canteenId || !menuItemId) {
      return res.status(400).json({
        success: false,
        msg: "Canteen Id and Menu Item Id are required.",
      });
    }

    const removedMenuItem = await Menu.findOneAndDelete({
      _id: menuItemId,
      canteenId,
    });

    if (!removedMenuItem) {
      return res.status(404).json({
        success: false,
        msg: "Menu Item Not Found or does not belong to the specified canteen.",
      });
    }

    return res.status(200).json({ success: true, removedMenuItem });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  displayCanteensWithOrders,
  addCanteen,
  removeCanteen,
  updateCanteen,
  displayMenuOfAllCanteens,
  addMenuItemInCanteen,
  updateMenuItemFromCanteen,
  removeMenuItemFromCanteen,
};
