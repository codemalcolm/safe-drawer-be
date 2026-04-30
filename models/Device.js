const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  drawerName: { type: String, required: true },
  drawerLocation: { type: String, required: true },
  raspberryPiId: { type: String, required: true },
  isLocked: { type: Boolean, required: true, default: true },
  timestamp: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false },
  hasIncident: { type: Boolean, default: false },
  lastUsed: { type: String, default: Date.now },
  createdAt: { type: String, default: Date.now },
  updatedAt: { type: String, default: Date.now },
});

module.exports = mongoose.model("Device", DeviceSchema);
