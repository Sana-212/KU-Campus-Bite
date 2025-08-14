const Menu = require("../models/foodMenu");

const getAllMenuStatic = async (req, res) => {
  const menus = await Menu.find();
  res.status(200).json(menus);
};

module.exports ={getAllMenuStatic}