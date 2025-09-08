const express = require("express");
const router = express.Router();

const { getAllMenu} = require("../controllers/menu");
const {getMenuItemFromCanteen}= require("../controllers/canteen")

router.route("/").get(getAllMenu);

// Gets a specific menu item from a specific canteen
router.route("/:canteenSlug/:menuSlug").get(getMenuItemFromCanteen)

module.exports = router;
