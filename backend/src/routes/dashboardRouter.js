const express = require("express")
const router = express.Router()
const { getDashboardData } = require("../controllers/dashboard")

router.route('/').get(getDashboardData)

module.exports = router