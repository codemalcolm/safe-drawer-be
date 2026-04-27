const NetworkConfig = require("../models/NetworkConfig");

const registerConfig = async (req, res) => {
  if (!req.body) return res.status(400).json({ error: "The request is incomplete" });

  const { raspberryPiId } = req.body;

  if (!raspberryPiId) return res.status(400).json({ error: "Device ID is required to claim a device." });
  
  // Fetch the network config from the unboxing phase
  const networkConfig = await NetworkConfig.findOne({ raspberryPiId });

  if (!networkConfig) {
    return res.status(404).json({
      error:
        "Configuration not found. Please complete the Wi-Fi configuration of your device first.",
    });
  }

  // Prevent Duplicates (Check if device is already claimed)
  const existingDevice = await Device.findOne({ raspberryPiId });

  if (existingDevice) {
    return res.status(409).json({
      error: "This SafeDrawer is already registered to an account.",
    });
  }

  try {
    // Everything checks out -> Create the actual Device object
    const newDevice = new Device({
      drawerName: networkConfig.drawerName,
      location: networkConfig.location || "unspecified",
      raspberryPiId: networkConfig.raspberryPiId,
      isLocked: true,
    });

    await newDevice.save();

    // Success! Return the new device to the frontend
    return res.status(201).json({
      success: true,
      message: "SafeDrawer successfully claimed!",
      device: newDevice,
    });
  } catch (error) {
    console.error("Error claiming device:", error);
    return res
      .status(500)
      .json({ error: "Internal server error while claiming device." });
  }
};

module.exports = { registerConfig };
