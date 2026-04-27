const mqtt = require("mqtt");

const client = mqtt.connect({
  host: process.env.MQTT_CLUSTER_URL || "host-url",
  port: 8883,
  protocol: "mqtts",
  username: process.env.MQTT_USERNAME || "",
  password: process.env.MQTT_PASSWORD || "",
});

client.on("connect", () => console.log("✅ Connected to MQTT Broker"));
module.exports = client;
