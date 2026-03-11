const express = require("express");
const router = express.Router();
const { addLog } = require("../controllers/logs");

router.route("/").post(addLog);

module.exports = router;
