const Canteen = require("../models/canteen");
const Menu = require("../models/foodMenu");

const getAllCanteens = async (req, res) => {
  try {
    const canteens = await Canteen.find({});
    res.status(200).json({ success: true, canteens });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

const getSingleCanteen = async (req, res) => {
  try {
    const { slug } = req.params;
    const canteen = await Canteen.findOne({ slug });
    if (!canteen) {
      res.status(404).json({ success: false, msg: "Canteen Not Found" });
    }

    //Find menu of that canteen
    const menuItems = await Menu.find({ canteenId: canteen._id });

    res
      .status(200)
      .json({ success: true, canteen: canteen.name, menu: menuItems });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

const getMenuItemFromCanteen = async (req, res) => {
  const { canteenSlug, menuSlug } = req.params;
  const canteen = await Canteen.findOne({ slug: canteenSlug });
  if (!canteen)
    res.status(404).json({ success: false, msg: "Canteen Not Found" });

  const menuItem = await Menu.findOne({
    slug: menuSlug,
    canteenId: canteen._id,
  }).populate("canteenId", "name");
  if (!menuItem)
    res
      .status(404)
      .json({ success: false, msg: "Menu item not found in this canteen" });

  res.status(200).json({ success: true, menuItem });
};

module.exports = { getAllCanteens, getSingleCanteen ,getMenuItemFromCanteen};
