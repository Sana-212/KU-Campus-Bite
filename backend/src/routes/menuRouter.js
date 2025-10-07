const express = require('express');
const router = express.Router();
const { getAllMenu } = require('../controllers/menu');

router.get('/', getAllMenu);

module.exports = router;
