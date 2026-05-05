const mqtt = require("mqtt");
const Device = require("../models/Device");
const Log = require("../models/Log");

const mqttClient = mqtt.connect({
  host: process.env.MQTT_CLUSTER_URL || "host-url",
  port: 8883,
  protocol: "mqtts",
  username: process.env.MQTT_USERNAME || "",
  password: process.env.MQTT_PASSWORD || "",
});

mqttClient.on("connect", () => {
  console.log("Ⓜ️  Backend successfully connected to MQTT Broker!");
  // Subscribes:
  mqttClient.subscribe("drawer/logs");
});

// TOPIC : drawer/logs
mqttClient.on("message", async (topic, payload) => {
  if (topic === "drawer/logs") {
    try {
      const data = JSON.parse(payload.toString());
      const { raspberryPiId, event, message, type, timestamp } = data;

      // Find DB Object using the Hardware ID
      const linkedDevice = await Device.findOne({
        raspberryPiId: raspberryPiId,
      });

      if (!linkedDevice) {
        console.warn(
          `[SECURITY] Ignored log from unknown hardware: ${raspberryPiId}`,
        );
        return;
      }

      // Save it to the database
      const newLog = await Log.create({
        drawerId: linkedDevice._id,
        event: event,
        type: type || "info",
        message: message,
        timestamp: timestamp
      });

      // !! remove after testing
      console.log(newLog);

      console.log(
        `[MQTT] Nový log uložen do DB pro šuplík: ${newLog.drawerId}`,
      );
    } catch (error) {
      console.error("Error processing MQTT log:", error.message);
    }
  }
});

// Online check 
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