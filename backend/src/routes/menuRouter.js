const express = require("express");
const router = express.Router();

const { getAllMenuStatic } = require("../controllers/menu");

router.route("/").get(getAllMenuStatic);

module.exports = router;
