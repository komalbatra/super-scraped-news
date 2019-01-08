var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/supernews";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// GET route for scraping website
app.get("/scrape", function(req, res) {
  // Grab the body of the html with axios
  axios.get("https://movieweb.com/superheroes/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("article").each(function(i, element) {
      var result = {};
      result.title = $(this)
        .find("h3")
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      result.summary = $(this)
        .find("p")
        .text()
        .trim();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id },{$push: { note: dbNote._id}}, { new: true })
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//Route for deleting a note
app.delete("/articles/:id", function(req, res) {
  db.Note.deleteOne({ _id: req.params.id })
  .then(function(removed) {
    res.json(removed);
  }).catch(function(err,removed) {
      res.json(err);
    });
});

// Start the server
app.listen(process.env.PORT || PORT, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
