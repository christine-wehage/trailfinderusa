var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// open db
var mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost/trails");
    
// define schema
var trailSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Trail = mongoose.model("Trail", trailSchema);

var request = require("request");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/results", function(req, res){
   request('https://developer.nps.gov/api/v1/activities/parks?id=BFF8C027-7C8F-480B-A5F8-CD8CE490BFBA&api_key=MDHpUXvvKO6gPxWpRGGyqhpUfGseSL7ekKqM2par', function(error, response, body){
       if(!error && response.statusCode == 200) {
           var results = JSON.parse(body)
           res.send(results);
       }
   });
});

app.get("/", function(req, res){
    res.render('home');
});


app.get("/trails", function(req, res){
     // pull all trails from db
    Trail.find ({}, function(err, allTrails){
        if(err){
            console.log(err);
        } else {
            res.render('trailsList', {trails:allTrails});
        }
    });
});

app.post("/trails", function(req, res){
    var name = req.body.trailName;
    var image = req.body.trailImage;
    var newTrail = {name: name, image: image}
    // create a new trail and save it to db
    Trail.create(newTrail, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            // redirect to trails list
             res.redirect("/trails");
        }
    });
});

//form to add a new trail
app.get("/trails/new", function(req, res){
    res.render("new.ejs");
});

app.get("*", function(req, res){
    res.send('404 file not found');
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Trailfinder server has started");
});