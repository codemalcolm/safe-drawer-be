const express = require("express");
const router = express.Router();
const { addLog, getAllLogs, deleteLog } = require("../controllers/logs");

router.route("/").post(addLog);

router.route("/:drawerId").get(getAllLogs);

router.route("/:id").delete(deleteLog);

module.exports = router;
