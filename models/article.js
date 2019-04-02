var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create schema
var ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true,
        unique: true
    },
    timestamp: {
        type: Date, 
        default: Date.now
    },
    saved: {
        type: Boolean,
        default: false
    },
    note: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

// Create model from schema
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;