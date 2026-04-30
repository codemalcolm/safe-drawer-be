const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  event: { type: String, required: true },
  type: { type: String, required: true, default: "info" },
  drawerId: {
    type: Schema.Types.ObjectId,
    ref: "Device",
    required: true, // card MUST be assigned to a drawer
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Log", LogSchema);
