// Endpoint to receive access logs from ESP32
const { allowedUIDs } = require("./uids");

const addLog = (req, res) => {
  const { event, message } = req.body;

  if (!event && !message)
    throw new BadRequestError("Log is missing event or message information.");

  console.log(`\n[ALERT] New Log Received!`);
  console.log(`Event: ${event}`);
  console.log(`Message: ${message}`);

  let esp32Command = "";

  // Extract just the UID string from the message
  const scannedUid = message.split(": ")[1];

  if (event === "RFID Scan") {
    if (allowedUIDs.includes(scannedUid)) {
      console.log(`✅ Access Granted for ${scannedUid}!`);
      esp32Command = "OPEN_DRAWER"; // Send the OPEN_DRAWER command
    } else {
      console.log(`❌ Access Denied for ${scannedUid}!`);
    }
  }

  // Respond back to ESP32 to confirm log
  res.status(200).json({
    status: "success",
    message: "Log saved to backend",
    logBody: { event, message },
  });
};

module.exports = { addLog };
