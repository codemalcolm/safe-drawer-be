//routy co komunikuji s IoT
const express = require("express");
const apiController = require("../controllers/apiController");
const router = express.Router();

router.get("/", apiController.routa);
router.post("/", apiController.routa2);

module.exports = router;
