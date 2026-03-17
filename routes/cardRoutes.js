//routy co komunikuji s IoT
const express = require("express");
const apiController = require("../controllers/cardController");
const router = express.Router();

router.get("/", apiController.get_all_cards);
router.get("/:id", apiController.get_one_card);

module.exports = router;
