const express = require("express");
const router = express.Router();

const {
  displayCanteensWithOrders,
  addCanteen,
  removeCanteen,
  updateCanteen,
  displayMenuOfAllCanteens,
  addMenuItemInCanteen,
  updateMenuItemFromCanteen,
  removeMenuItemFromCanteen,
} = require("../controllers/dashboardCanteens");

router.route("/").get(displayMenuOfAllCanteens).post(addCanteen);

router.route("/:canteenId").patch(updateCanteen).delete(removeCanteen);

router.route("/:canteenId/menuItems").post(addMenuItemInCanteen);

router
  .route("/:canteenId/menuItems/:menuItemId")
  .patch(updateMenuItemFromCanteen)
  .delete(removeMenuItemFromCanteen);

router.route("/orders").get(displayCanteensWithOrders);

module.exports = router;
