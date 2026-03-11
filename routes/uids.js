const express = require("express");
const router = express.Router();
const { addUid } = require("../controllers/uids");

router.route("/").post(addUid)

module.exports = router