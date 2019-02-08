const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const noteSchema = new Schema({
    body: {
        type: String
    }
});

// Create model from schema
const note = mongoose.model("note", noteSchema);

module.exports = note;