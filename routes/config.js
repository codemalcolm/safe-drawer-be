const express = require("express");
const router = express.Router();
const { registerConfig, removeConfig } = require("../controllers/config");

router.route("/").post(registerConfig).delete(removeConfig);

module.exports = router;
