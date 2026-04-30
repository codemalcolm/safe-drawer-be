const mongoose = require("mongoose");

// Check if ID is a valid MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports = { isValidId };
