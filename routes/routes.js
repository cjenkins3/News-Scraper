// dependencies
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");



module.exports = (app)=>{
    // main page
    app.get("/", (req, res)=>{
        
        db.Article.find({})
        .sort({timestamp: -1})
        .then((dbArticle)=>{
            if (dbArticle.length == 0) {
                
                res.render("index");
            }
            else {
                //show articles
                res.redirect("/articles");
            }
        })
        .catch((err)=>{
            res.json(err);
        });
    });

    // saved articles page
    app.get("/saved", (req, res)=>{
        db.Article.find({saved: true})
        .then((dbArticle)=>{
            let articleObj = {article: dbArticle};

            // render page with articles found
            res.render("saved", articleObj);
        })
        .catch((err)=>{
            res.json(err);
        });
    });

    // scrape data then save to mongodb
    app.get("/scrape", (req, res)=>{
        // get body of url
        axios.get("https://www.cnn.com/specials/last-50-stories")
        .then((response)=>{
            // use cheerio for shorthand selector $
            var $ = cheerio.load(response.data);
            
            $(`li`).each(function(i, element) {
                // console.log(".cd__headline-text");
                let result = {};
                var headline = $(this).find(".cd__headline-text").text();
                var link = $(this).find("a").attr("href");
                var summary = $(this).find(".zn-body__paragraph.speakable").text();
                console.log(headline, link, summary);

                result.headline = headline;
                result.link = link;
                result.summary = summary;
               
                // create new Article
                db.Article.create(result)
                .then((dbArticle)=>{
                    console.log(`\article scraped: ${dbArticle}`);
                })
                .catch((err)=>{
                    console.log(`\error while saving to database: ${err}`);
                });
            });

            res.redirect("/articles");
        })
        .catch((error)=>{
            console.log(`error while getting data from url: ${error}`);
        });
    })

    // show articles after scraping
    app.get("/articles", (req, res)=>{
        db.Article.find({})
        .sort({timestamp: -1})
        .then((dbArticle)=>{
            let articleObj = {article: dbArticle};

            // render page with articles found
            res.render("index", articleObj);
        })
        .catch((err)=>{
            res.json(err);
        });
    });

    // save article
    app.put("/articles/:id", (req, res)=>{
        let id = req.params.id;

        db.Article.findByIdAndUpdate(id, {$set: {saved: true}})
        .then((dbArticle)=>{
            res.json(dbArticle);
        })
        .catch((err)=>{
            res.json(err);
        });
    });

    // remove article from page "saved"
    app.put("/articles/remove/:id", (req, res)=>{
        let id = req.params.id;

        db.Article.findByIdAndUpdate(id, {$set: {saved: false}})
        .then((dbArticle)=>{
            res.json(dbArticle);
        })
        .catch((err)=>{
            res.json(err);
        });
    });

    // get current notes
    app.get("/articles/:id", (req,res)=>{
        let id = req.params.id;

        // cannot get notes associated with article, only the very first one
        db.Article.findById(id)
        .populate("note")
        .then((dbArticle)=>{
            res.json(dbArticle);
        })
        .catch((err)=>{
            res.json(err);
        });
    });

    // save new note
    app.post("/note/:id", (req, res)=>{
        let id = req.params.id;

        db.Note.create(req.body)
        .then((dbNote)=>{
            return db.Article.findOneAndUpdate({
                _id: id
            }, {
                $push: {
                    note: dbNote._id
                }
            }, {
                new: true, upsert: true
            });
        })
        .then((dbArticle)=>{
            res.json(dbArticle);
        })
        .catch((err)=>{
            res.json(err);
        });
    });

    // delete note
    app.delete("/note/:id", (req, res)=>{
        let id = req.params.id;
        
        db.Note.remove({_id: id})
        .then((dbNote)=>{
            res.json({message: "note removed!"});
        })
        .catch((err)=>{
            res.json(err);
        });
    });
};