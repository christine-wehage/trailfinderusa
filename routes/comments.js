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
    Trail.findById(req.params.id).populate("comments").exec(function(err, trail){
        if(err){
            console.log(err);
            return res.redirect("back");
        } 
            //create the new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } 
                Comment.create(req.body.comment, function(err, comment){
                    if(err) {
                        console.log("error", err.message);
                        return res.redirect("back");
                    }
                    // add username and id to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.trail = trail;
                    //save the comment
                    comment.save();
                   //associate comment to trail
                   trail.comments.push(comment);
                //   trail.rating = calculateAverage(trail.rating);
                   // save trail
                    trail.save();
                   //redirect to trail show details
                   console.log("success", "Your rating has been successfully added.");
                   res.redirect("/trails/" + trail._id);

            });
        });
    });
});

// NEED TO FIX this func
// function calculateAverage(comments) {
//     if (comments.length === 0) {
//         return 0;
//     }
//     for(var sum = 0, len = comments.length; sum < len; sum++){
//         sum += comments.rating;
//     }
// }

module.exports = router;