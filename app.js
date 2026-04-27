const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db-connect");

const uidsRouter = require("./routes/uids");
const logsRouter = require("./routes/logs");
const cardRouter = require("./routes/cardRoutes");
const devicesRouter = require("./routes/devices");
const configRouter = require("./routes/config");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/api/v1/hello", (req, res) => {
  res.json({ message: "IoT Projekt be běží" });
});

// Definice rout
// Vsechny routy z routeru budou zacint na /api/v1/(jméno_routy)
app.use("/api/v1/cards", cardRouter);
app.use("/api/v1/devices", devicesRouter);
app.use("/api/v1/devices/config", configRouter);
app.use("/api/v1/uids", uidsRouter);
app.use("/api/v1/logs", logsRouter);

// 404 | (!) -> musí být vždy poslední jinak catchne každý request jako 404
app.use((req, res) => {
  res.status(404).json({ message: "Tato adresa neexistuje" });
});

const start = async () => {
  try {
    await connectDB();
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`-----------------------------------------`);
      console.log(`Server nastartován na portu: ${PORT}`);
      console.log(`Endpoint pro logy: http://localhost:${PORT}/api/v1/logs`);
      console.log(`-----------------------------------------`);
    });
  } catch (error) {
    console.log("Chyba při startu:", error);
  }
};

start();
