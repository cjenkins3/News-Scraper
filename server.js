const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const logger = require("morgan");
const bodyParser = require("body-parser");

let PORT = process.env.PORT || 3000;
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// initialize express
const app = express();

// use morgan logger for logging requests
app.use(logger("dev"));
// use body-parser for handling form submissions
app.use(bodyParser.urlencoded({extended: true}));
// set static directory
app.use(express.static("public"));
// Set Handlebars as the default templating engine
app.engine("handlebars",handlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// database configuration
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

// check connection status
let db = mongoose.connection;
db.on("error", (error)=>{
    console.log(`Connection error ${error}`);
});

require("./routes/routes.js")(app);

// start server
app.listen(PORT, ()=>{
    console.log(`App running on port http://localhost:${PORT}`);
});