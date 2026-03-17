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
}
// Test pripojeni
connectDB().then(() => {
    console.log('hura')
}).catch(err => {
    console.log('caruju kraliky')
});

module.exports = connectDB;

/*---------PRIKLAD POUZITI V SOUBORU------------
const connectToDatabase = require('./config/db-connect'); 
const Card = require('./models/Card'); // Cesta k tvému modelu

async function runTask() {
    await connectToDatabase();
    
    // Mongoose najde kolekci automaticky podle modelu
    const karta = await Card.findOne({ uid: "12345" }); 
    console.log(karta);
}
runTask();*/