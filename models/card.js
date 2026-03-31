//schema karty
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  user: {
    type: String, //username stylu komentar
    default: "unknown",
    required: true,
  },
  authorization: {
    type: Boolean,
    required: true,
    default: false, //nova karta se bude do db automaticky ukladat jako neautorizovana
  },
});

//v mongoose se neresi id objektu db

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
