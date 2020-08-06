var express = require("express");
var router = express.Router({mergeParams: true});
var Trail = require("../models/trail.js");
var Comment = require("../models/comment.js");

// middleware check for login
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

router.get("/new", function(req, res){
    Trail.findById(req.params.id, function(err, trail){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {trail: trail});
        }
    });
 
});

router.post("/", isLoggedIn, function(req, res){
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
                    // add username and id to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
                   //associate comment to trail
                   trail.comments.push(comment);
                   trail.save();
                   //redirect to trail show details
                   res.redirect("/trails/" + trail._id);
                }
            });
        }
    });
    
    
    
});

module.exports = router;