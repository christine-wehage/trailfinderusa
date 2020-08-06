var express = require("express");
var router = express.Router();
var Trail = require("../models/trail.js")

// middleware check for login
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}



router.get("/", function(req, res){
     // pull all trails from db
    Trail.find ({}, function(err, allTrails){
        if(err){
            console.log(err);
        } else {
            res.render('trails/index.ejs', {trails:allTrails});
        }
    });
});

//create new trail route
router.post("/", function(req, res){
    var name = req.body.trailName;
    var image = req.body.trailImage;
    //associate author username to newly created trail
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    // create a new trail, sanitize, and save it to db
     var newTrail = {name: name, image: image, author: author};
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
router.get("/new",isLoggedIn, function(req, res){
    res.render("trails/new.ejs");
});

//pull trail id and render edit trail page
router.get("/:id/edit", isLoggedIn, function(req, res){
    Trail.findById(req.params.id, function(err, foundTrail){
        if(err){
            res.redirect("/trails");
        } else{
            res.render("./trails/edit.ejs", {trail: foundTrail});
        }
    });
});

//edit trail route
router.put("/:id", function(req, res){
    Trail.findByIdAndUpdate(req.params.id, req.body.trail, function(err, updatedTrail){
        if(err){
            res.redirect("/trails");
        } else {
            res.redirect("/trails/" + req.params.id);
        }
    });
});

//delete the trail route
router.delete("/:id", function(req, res){
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
router.get("/:id", function(req, res){
    Trail.findById(req.params.id).populate("comments").exec(function(err, foundTrail){
        if(err){
            console.log(err);
        } else{
            res.render("trails/show.ejs", {trail: foundTrail});
        }
    });
});

module.exports = router;