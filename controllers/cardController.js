//import schematu karty a pripadne dalsich
const Card = require("../models/card");

//vsechny api routy

exports.get_all_cards = async (req, res) => {
  try {
    const cards = await Card.find({}); 
    
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: "Chyba při načítání karet", error: error.message });
  }
};




