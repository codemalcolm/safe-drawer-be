const express = require("express");
const router = express.Router();
const {
  addDevice,
  removeDevice,
  getAllDevices,
} = require("../controllers/devices");

router.route("/").get(getAllDevices).post(addDevice).delete(removeDevice);

module.exports = router;
