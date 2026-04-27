const mqttClient = require("../tools/mqttClient"); // Assuming you set this up from earlier

const toggleOnline = async (req, res) => {
  // 1. Check if the backend is even connected to the cloud broker
  if (!mqttClient.connected) {
    return res.status(503).json({
      status: "Offline",
      message: "Server disconnected from MQTT broker",
    });
  }
  // 2. Wrap the async MQTT listener in a Promise
  const checkHardwareStatus = new Promise((resolve) => {
    const timeout = setTimeout(() => {
      mqttClient.removeListener("message", messageHandler);
      resolve(false);
    }, 3000);

    const messageHandler = (topic, message) => {
      if (topic === "drawer/logs") {
        try {
          const data = JSON.parse(message.toString());
          if (data.event === "Ping" && data.message === "PONG") {
            clearTimeout(timeout);
            mqttClient.removeListener("message", messageHandler);
            resolve(true);
          }
        } catch (error) {
          // Ignore bad JSON
        }
      }
    };

    mqttClient.on("message", messageHandler);

    // subscribe, wait for success, THEN publish
    mqttClient.subscribe("drawer/logs", (err) => {
      if (!err) {
        mqttClient.publish("drawer/command", "PING\n");
      }
    });
  });

  // 4. Wait for the result and send the UI response
  const isHardwareOnline = await checkHardwareStatus;

  if (isHardwareOnline) {
    return res.status(200).json({
      status: "Online",
      message: "Physical IoT circuit pinged successfully",
    });
  } else {
    return res.status(503).json({
      status: "Offline",
      message: "Physical IoT circuit is completely unresponsive",
    });
  }
};

const addDevice = async (req, res) => {
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

module.exports = { toggleOnline,addDevice };
