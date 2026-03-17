const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URI;
const client = new MongoClient(url);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Připojeno k MongoDB Atlas");
        
        const db = client.db('IoT'); //vraci vsechny kolekce v db IoT
        
        return { db, client }; //funkce vyplivne db a client pro jeho pripadne pozdejsi zavreni
    } catch (error) {
        console.error("Chyba připojení:", error);
        throw error;
    }
}

// Test pripojeni
connectToDatabase().then(() => {
    process.exit(0);
}).catch(err => {
    process.exit(1);
});

module.exports = connectToDatabase;

/*---------PRIKLAD POUZITI V SOUBORU------------
const connectToDatabase = require('./config/db-connect'); 
async function runTask() {
    const { db } = await connectToDatabase();
    const cards = db.collection('cards_db'); 
    const karta = await cards.findOne({ majitelId: clovek._id })
    }
runTask.()*/