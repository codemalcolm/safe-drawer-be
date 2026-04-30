const mongoose = require("mongoose");
const Card = require("../models/card");

// Check if ID is a valid MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const get_all_cards = async (req, res) => {
  try {
    const { drawerId } = req.params;

    if (!isValidId(drawerId)) {
      return res
        .status(400)
        .json({ message: "Neplatný formát ID šuplíku (drawerId)" });
    }

    // Find only the cards where the drawerId matches, and populate the drawer data
    const cards = await Card.find({ drawerId: drawerId }).populate("drawerId");

    res.status(200).json({ status: "ok", cards });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Chyba při načítání karet", error: error.message });
  }
};

const create_card = async (req, res) => {
  try {
    const { cardId, note, drawerId } = req.body;

    if (!cardId) {
      return res.status(400).json({ message: "Položka 'cardId' je povinná." });
    }

    if (drawerId && !isValidId(drawerId)) {
      return res.status(400).json({ message: "Neplatný formát 'drawerId'." });
    }

    const newCard = new Card(req.body);
    await newCard.save();

    res.status(201).json({ status: "ok", newCard });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Chyba validace dat", error: error.message });
    }
    res
      .status(500)
      .json({ message: "Chyba při vytváření karty", error: error.message });
  }
};

const update_card = async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).json({ error: "Request body is missing" });
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Neplatný formát ID karty" });
    }

    // Automatically update the 'updatedAt' timestamp
    const updateData = { ...req.body, updatedAt: Date.now() };

    const updatedCard = await Card.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // DONT REMOVE: Force Mongoose to apply schema rules on updates
    }).populate("drawerId");

    if (!updatedCard) {
      return res.status(404).json({ message: "Karta k úpravě nenalezena" });
    }

    res.status(200).json({
      status: "ok",
      message: "Karta byla úspěšně upravena",
      updatedCard,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Chyba validace dat při úpravě",
        error: error.message,
      });
    }
    res.status(500).json({ message: "Chyba při úpravě", error: error.message });
  }
};

const delete_card = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Neplatný formát ID karty" });
    }

    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).json({ message: "Karta ke smazání nenalezena" });
    }

    res
      .status(200)
      .json({
        status: "ok",
        message: "Karta byla úspěšně smazána",
        deletedCard,
      });
  } catch (error) {
    res.status(500).json({ message: "Chyba při mazání", error: error.message });
  }
};

module.exports = {
  get_all_cards,
  create_card,
  delete_card,
  update_card,
};
