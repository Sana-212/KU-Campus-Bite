const express = require("express");
const router= express.Router()

const { getAllOrders } = require("../controllers/dashboardOrder");

router.route('/').get(getAllOrders);

module.exports = router;
