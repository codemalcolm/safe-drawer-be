//routy co komunikuji s IoT
const express = require("express");
const apiController = require("../controllers/cardController");
const router = express.Router();

router.get("/:drawerId", apiController.get_all_cards);
router.delete("/:id", apiController.delete_card);
router.post("/", apiController.create_card);
router.put("/:id", apiController.update_card);

module.exports = router;
