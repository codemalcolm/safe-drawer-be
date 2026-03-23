const express = require("express");
const router = express.Router();
const { addLog, getAllLogs, deleteLog } = require("../controllers/logs");

// Na cestě "/" (což je ve skutečnosti /api/v1/logs)
router.route("/")
    .post(addLog)      // Vytvoří log
    .get(getAllLogs);  // Vypíše všechny logy

// Na cestě "/:id" (např. /api/v1/logs/6601...)
router.route("/:id")
    .delete(deleteLog); // Smaže konkrétní log

module.exports = router;