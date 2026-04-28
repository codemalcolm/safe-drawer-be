const express = require("express");
const router = express.Router();
const {
  toggleOnline,
  addDevice,
  removeDevice,
} = require("../controllers/devices");

router.route("/").get(toggleOnline).post(addDevice).delete(removeDevice);

module.exports = router;
