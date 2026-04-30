const NetworkConfig = require("../models/NetworkConfig");
const encrypt = require("../tools/encrypt");

const registerConfig = async (req, res) => {
  try {
    const { drawerName, raspberryPiId, ssid, password, location } = req.body;

    if (!drawerName || !raspberryPiId || !ssid || !password) {
      return res
        .status(400)
        .json({ error: "Missing required configuration details." });
    }

    // Encrypt the incoming plain-text password
    const encryptedPassword = encrypt(password);

    // This looks for an existing config for this specific Pi.
    // If it finds one, it updates it. If it doesn't exist, it creates a new one.
    const savedConfig = await NetworkConfig.findOneAndUpdate(
      { raspberryPiId }, // The search filter
      {
        drawerName,
        ssid,
        password: encryptedPassword,
        location: location || "unspecified",
      },
      { new: true, upsert: true }, // 'upsert: true' is the magic command here
    );

    // Respond to the Raspberry Pi
    return res.status(200).json({
      success: true,
      message: "Configuration successfully registered to the cloud.",
      configId: savedConfig._id,
    });
  } catch (error) {
    console.error("Error saving network config to database:", error);
    return res.status(500).json({
      error: "Internal server error while registering config.",
      errorMsg: error,
    });
  }
};

const removeConfig = async (req, res) => {
  const { raspberryPiId } = req.body;
  if (!req.body) {
    return res.status(400).json({ error: "Request is missing a payload" });
  }
  if (!raspberryPiId)
    return res
      .status(400)
      .json({ error: "deviceId is needed for config removal" });

  try {
    const removedConfig = await NetworkConfig.findOneAndDelete({raspberryPiId});

    if (!removedConfig)
      return res
        .status(404)
        .json({ error: `Configuration with id ${raspberryPiId} not found` });

    res.status(200).json({
      status: "ok",
      msg: "Configuration removed successfully",
      deviceId: raspberryPiId,
    });
  } catch (error) {
    res.status(500).json({
      error: "Unexpected error occured when deleting configuration",
      errorMsg: error,
    });
  }
};

const getConfig = async (req,res)=>{
}

module.exports = { registerConfig, removeConfig };
