const express = require("express")
const router = express.Router()

const {getAllCanteens,getSingleCanteen,getMenuItemFromCanteen}=require("../controllers/canteen")

router.route('/').get(getAllCanteens);

router.route('/:slug').get(getSingleCanteen)

router.route('/:canteenSlug/:menuSlug').get(getMenuItemFromCanteen)

module.exports = router;