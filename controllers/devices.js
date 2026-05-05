const NetworkConfig = require("../models/NetworkConfig");
const Device = require("../models/Device");
const mqttClient = require("../tools/mqttClient"); // Assuming you set this up from earlier

const addDevice = async (req, res) => {
  if (!req.body)
    return res.status(400).json({ error: "The request is incomplete" });

  console.log(req.body);

  const { raspberryPiId, drawerName, drawerLocation } = req.body;

  if (!raspberryPiId)
    return res
      .status(400)
      .json({ error: "Device ID is required to claim a device." });
  if (!drawerName || !drawerLocation)
    return res.status(400).json({
      error: "Drawer name and drawer location is needed to claim a device",
    });

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
      drawerName,
      drawerLocation,
      raspberryPiId: networkConfig.raspberryPiId,
      isLocked: true,
    });

    await newDevice.save();

    // Success! Return the new device to the frontend
    return res.status(201).json({
      success: true,
      message: "SafeDrawer successfully claimed!",
    });
  } catch (error) {
    console.error("Error claiming device:", error);
    return res.status(500).json({
      error: "Internal server error while claiming device.",
      errorMsg: error,
    });
  }
};

const removeDevice = async (req, res) => {
  try {
    // Note: If you switch to passing the ID in the URL, this would be req.params.raspberryPiId
    const { raspberryPiId } = req.body;

    if (!raspberryPiId) {
      return res
        .status(400)
        .json({ error: "Device ID is required to remove a safe." });
    }

    const deletedDevice = await Device.findOneAndDelete({ raspberryPiId });

    if (!deletedDevice) {
      return res
        .status(404)
        .json({ error: "Device not found or already deleted." });
    }

    return res.status(200).json({
      success: true,
      message: "SafeDrawer successfully removed",
      deletedDeviceId: raspberryPiId,
    });
  } catch (error) {
    console.error("Error removing device:", error);
    return res
      .status(500)
      .json({ error: "Internal server error while removing device." });
  }
};

const getAllDevices = async (req, res) => {
  try {
    const fetchedDevices = await Device.find();
    if (!fetchedDevices)
      return res.status(404).json({ error: "No devices found" });

    return res.status(200).json({ success: "ok", fetchedDevices });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unexpected error occured", errorMsg: error });
  }
};

module.exports = { addDevice, removeDevice, getAllDevices };
