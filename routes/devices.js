const express = require("express");
const router = express.Router();
const { toggleOnline } = require("../controllers/devices");

router.route("/").get(toggleOnline);

module.exports = router;
