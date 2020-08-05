var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require('express-sanitizer');

// open db
var mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost/trails");
    
var Trail = require("./models/trail.js");
var Comment = require("./models/comment.js");
var seedDB = require("./seeds.js");
    seedDB();
var request = require("request");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


//GET ROUTES

app.get("/", function(req, res){
    res.render('home.ejs');
});

app.get("/trails", function(req, res){
     // pull all trails from db
    Trail.find ({}, function(err, allTrails){
        if(err){
            console.log(err);
        } else {
            res.render('trails/index.ejs', {trails:allTrails});
        }
    });
});

//CREATE ROUTE
app.post("/trails", function(req, res){
    var name = req.body.trailName;
    var image = req.body.trailImage;
    var newTrail = {name: name, image: image};
    // create a new trail, sanitize, and save it to db
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
    res.render("trails/new.ejs");
});

//pull id trail and render edit page
app.get("/trails/:id/edit", function(req, res){
    Trail.findById(req.params.id, function(err, foundTrail){
        if(err){
            res.redirect("/trails");
        } else{
            res.render("./trails/edit.ejs", {trail: foundTrail});
        }
    });
});

//update trail route
app.put("/trails/:id", function(req, res){
    Trail.findByIdAndUpdate(req.params.id, req.body.trail, function(err, updatedTrail){
        if(err){
            res.redirect("/trails");
        } else {
            res.redirect("/trails/" + req.params.id);
        }
    });
});

//delete the trail route
app.delete("/trails/:id", function(req, res){
    Trail.findByIdAndRemove(req.params.id, req.body.trail, function(err){
        if(err){
            console.log(err);
            res.redirect("/trails");
        } else {
            res.redirect("/trails/");
        }
    });
});

//pull id trail and render show page
app.get("/trails/:id", function(req, res){
    Trail.findById(req.params.id).populate("comments").exec(function(err, foundTrail){
        if(err){
            console.log(err);
        } else{
            res.render("trails/show.ejs", {trail: foundTrail});
        }
    });
});

//Comments route
app.get("/trails/:id/comments/new", function(req, res){
    Trail.findById(req.params.id, function(err, trail){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {trail: trail});
        }
    });
 
});

app.post("/trails/:id/comments", function(req, res){
    //lookup trail by id
    Trail.findById(req.params.id, function(err, trail){
        if(err){
            console.log(err);
            res.redirect("/trails");
        } else {
            //create the new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                   //associate comment to trail
                   trail.comments.push(comment);
                   trail.save();
                   //redirect to trail show details
                   res.redirect("/trails/" + trail._id);
                }
            });
        }
    });
    
    
    
})

app.get("*", function(req, res){
    res.send('404 file not found');
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Trailfinder server has started");
});