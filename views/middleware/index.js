var Trail = require("../models/trail");
var Comment = require("../models/comment");

var middlewareObj = {};


middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Trail.findById(req.params.id).populate("comments").exec(function (err, foundTrail) {
            if (err || !foundTrail) {
                req.flash("error", "Trail not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundTrail.comments
                var foundUserComment = foundTrail.comments.some(function (comment) {
                    return comment.author.id.equals(req.user._id);
                });
                if (foundUserComment) {
                    req.flash("error", "You already wrote a comment.");
                    return res.redirect("/trails/" + foundTrail._id);
                }
                // if the comment was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;