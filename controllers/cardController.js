//import schematu karty a pripadne dalsich
const Card = require("../models/card");

//vsechny api routy

const get_all_cards = async (req, res) => {
  try {
    const cards = await Card.find({});

    res.status(200).json(cards);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Chyba při načítání karet", error: error.message });
  }
};

const get_one_card = async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({ message: "Karta nebyla nalezena" });
    }

    res.status(200).json(card);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Chyba při načítání karty", error: error.message });
  }
};

const delete_card = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).json({ message: "Karta ke smazání nenalezena" });
    }

    res
      .status(200)
      .json({ message: "Karta byla úspěšně smazána", deletedCard });
  } catch (error) {
    res.status(500).json({ message: "Chyba při mazání", error: error.message });
  }
};

const create_card = async (req, res) => {
  try {
    const newCard = new Card(req.body);
    await newCard.save();

    res.status(201).json(newCard);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Chyba při vytváření karty", error: error.message });
  }
};

const update_card = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCard = await Card.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCard) {
      return res.status(404).json({ message: "Karta k úpravě nenalezena" });
    }

    res.status(200).json({
      message: "Karta byla úspěšně upravena",
      updatedCard,
    });
  } catch (error) {
    res.status(500).json({
      message: "Chyba při úpravě",
      error: error.message,
    });
  }
};

module.exports = {
  get_all_cards,
  get_one_card,
  create_card,
  delete_card,
  update_card,
};
