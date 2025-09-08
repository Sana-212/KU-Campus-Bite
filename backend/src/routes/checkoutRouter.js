const express = require('express')
const router = express.Router()
const authMiddleware=require('../middleware/authMiddleware')
const {checkout} = require('../controllers/checkout')

router.post('/checkout',authMiddleware,checkout);

module.exports=router;