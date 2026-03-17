//routy co komunikuji s IoT
const express = require("express");
const apiController = require("../controllers/cardController");
const router = express.Router();

router.get("/", apiController.get_all_cards);
router.get("/:id", apiController.get_one_card);
router.delete("/:id", apiController.delete_card);
router.post("/", apiController.create_card);
router.put("/:id", apiController.update_card);

module.exports = router;
