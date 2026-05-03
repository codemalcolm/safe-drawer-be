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
      const { raspberryPiId, event, message, type } = data;

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

      console.log(linkedDevice);

      // Save it to the database
      const newLog = await Log.create({
        drawerId: linkedDevice._id,
        event: event,
        type: type || "info",
        message: message,
      });


      console.log(
        `[MQTT] Nový log uložen do DB pro šuplík: ${newLog.drawerId}`,
      );
    } catch (error) {
      console.error("Error processing MQTT log:", error.message);
    }
  }
});
