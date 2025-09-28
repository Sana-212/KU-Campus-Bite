const express = require('express');
const { getReportData } = require('../controllers/dashboardReport');
const router = express.Router()

router.route('/').get(getReportData);
module.exports= router;