const express = require("express");
const router = express.Router();

const { getAllMenu,getSingleMenuItem } = require("../controllers/menu");

router.route("/").get(getAllMenu);

router.route("/:slug").get(getSingleMenuItem)

module.exports = router;
