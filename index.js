const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());
const port = process.env.PORT | 3000;

app.get("/api/v1/hello", (req, res) => {
  res.json({ message: "Hello from be" });
});

// Endpoint to receive access logs from ESP32
app.post("/api/v1/log", (req, res) => {
  const { event, message } = req.body;
  if (!event && !message) throw new Error("Error occured in request body");

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
});

// local "DB" for testing
let allowedUIDs = [];

// Endpoint to manage allowed UIDs
// TODO : Implement Database so that there is not a local variable
// UID is sent with a allowed: boolean in request body
app.post("/api/v1/uid", (req, res) => {
  const { uid, allowed } = req.body;
  if (!uid || typeof allowed !== "boolean") {
    return res
      .status(400)
      .json({ error: "Valid UID and allowed boolean are required." });
  }

  if (allowed) {
    if (!allowedUIDs.includes(uid)) allowedUIDs.push(uid);
  } else {
    allowedUIDs = allowedUIDs.filter((id) => id !== uid);
  }

  const uidMsg = allowed
    ? `Access granted to card with UID:${uid}`
    : `Access removed from card with UID:${uid}`;

  res.status(200).json({
    status: "success",
    message: uidMsg,
    uidBody: { uid, allowed },
  });
});

// TODO GET ALL SCANNED CARDS TO THIS POINT

// Start the server
const start = async () => {
  try {
    // await connectDB function here
    console.log("DB connected");
    app.listen(port, () => {
      console.log(
        `Express Backend running on port http://localhost:${port}...`,
      );
    });
  } catch (error) {
    console.log(error);
  }
};

start();
