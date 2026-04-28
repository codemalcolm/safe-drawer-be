const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  drawerName: { type: String, required: true },
  drawerLocation: { type: String, required: true },
  raspberryPiId: { type: String, required: true },
  isLocked: { type: Boolean, required: true, default: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Device", DeviceSchema);
