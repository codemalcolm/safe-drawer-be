// models/NetworkConfig.js
const mongoose = require("mongoose");

const NetworkConfigSchema = new mongoose.Schema({
  drawerName: { type: String, required: true },
  raspberryPiId: { type: String, required: true },
  ssid: { type: String, required: true },
  password: { type: String, required: true },
  location: { type: String, required: false, default: "unspecified" },
});

module.exports = mongoose.model("NetworkConfig", NetworkConfigSchema);