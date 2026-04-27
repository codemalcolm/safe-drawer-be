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



module.exports = { toggleOnline };
