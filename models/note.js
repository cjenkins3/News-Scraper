var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create schema
var NoteSchema = new Schema({
    body: {
        type: String
    }
});

// Create model from schema
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;