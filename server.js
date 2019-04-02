var express = require("express");
var handlebars = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");
var bodyParser = require("body-parser");


// require all models
var db = require("./models");

const PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://admin:Gobears09@ds211635.mlab.com:11635/heroku_snq43xfv";

// initialize express
var app = express();

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
mongoose.set("useCreateIndex", true);
mongoose.set("findOneAndReplace", true);

// check connection status
var db = mongoose.connection;
db.on("error", (error)=>{
    console.log(`Connection error ${error}`);
});

require("./routes/routes.js")(app);

// starts server
app.listen(PORT, ()=>{
    console.log(`App running on port http://localhost:${PORT}`);
});