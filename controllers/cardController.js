//import schematu karty a pripadne dalsich
const Card = require("../models/card");

//vsechny api routy

const get_all_cards = async (req, res) => {
  try {
    const cards = await Card.find({}); 
    
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: "Chyba při načítání karet", error: error.message });
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
    res.status(500).json({ message: "Chyba při načítání karty", error: error.message });
  }
};

module.exports = {
  get_all_cards,
  get_one_card
}


