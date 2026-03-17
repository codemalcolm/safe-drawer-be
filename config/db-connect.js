const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const url = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongoose připojen k MongoDB");
  } catch (err) {
    console.error("Chyba Mongoose:", err);
    process.exit(1);
  }
};

// Test pripojeni
connectDB().then(() => {
    process.exit(0);
}).catch(err => {
    process.exit(1);
});

module.exports = connectDB;
/*---------PRIKLAD POUZITI V SOUBORU------------
const connectToDatabase = require('./config/db-connect'); 
async function runTask() {
    const { db } = await connectToDatabase();
    const cards = db.collection('cards_db'); 
    const karta = await cards.findOne({ majitelId: clovek._id })
    }
runTask.()*/