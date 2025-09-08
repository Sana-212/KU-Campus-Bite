const express = require("express")
const router = express.Router();

const {addToCart,getCart,updateCart,removeItemFromCart,clearCart}= require("../controllers/cart")

router.route("/").get(getCart)
router.route("/add").post(addToCart);
router.route("/update").patch(updateCart)
router.route("/remove").delete(removeItemFromCart)
router.route("/clear").delete(clearCart)

module.exports = router