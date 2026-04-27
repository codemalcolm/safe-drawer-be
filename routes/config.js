const express = require("express");
const router = express.Router();
const { registerConfig } = require("../controllers/config");

router.route("/").post(registerConfig);

module.exports = router;
