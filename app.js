const express = require("express");
require("dotenv").config();
const connectToDatabase = require("./config/db-connect"); 
const cardRoutes = require("./routes/cardRoutes"); 
const cors = require("cors");

const app = express();

// middleware
app.use(cors())
app.use(express.json());

// db connect
connectToDatabase();

// Definice rout
// Vsechny routy z routeru budou zacint na /api/cards
app.use("/api/cards", cardRoutes);

// base routa pro test jestli server bezi
app.get("/", (req, res) => {
  res.send("IoT Projekt be běží");
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Tato adresa neexistuje" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`-----------------------------------------`);
  console.log(`Server nastartován na portu: ${PORT}`);
  console.log(`Endpoint pro karty: http://localhost:${PORT}/api/cards`);
  console.log(`-----------------------------------------`);
});