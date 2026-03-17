//routy co komunikuji s IoT
const express = require("express");
const apiController = require("../controllers/cardController");
console.log("DEBUG - Typ get_all_cards:", typeof apiController.get_all_cards);
const router = express.Router();

router.get("/", apiController.get_all_cards);

module.exports = router;
