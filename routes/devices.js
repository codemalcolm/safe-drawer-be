const express = require("express");
const router = express.Router();
const { toggleOnline, addDevice } = require("../controllers/devices");

router.route("/").get(toggleOnline).post(addDevice);

module.exports = router;
