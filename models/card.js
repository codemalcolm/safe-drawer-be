//schema karty
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  cardId: {
    type: String,
    required: true,
  },
  note: {
    type: String, //username stylu komentar
    default: "unknown",
    required: true,
  },
  isAuthorized: {
    type: Boolean,
    required: true,
    default: false,
  }, //nova karta se bude do db automaticky ukladat jako neautorizovana
  lastUsed: { type: Date, default: Date.now() },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  drawerId: {
    type: Schema.Types.ObjectId,
    ref: "Drawer", // This must match the exact name you gave your Drawer model
    required: false, // Set to true if a card MUST be assigned to a drawer
  },
});

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
