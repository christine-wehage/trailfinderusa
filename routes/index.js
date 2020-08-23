var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Trail = require("../models/trail.js")



//sign up form
router.get("/register", function(req, res) {
    res.render("register.ejs");
});

// handle superuser registration
router.post("/register", function(req, res) {
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
            passport.authenticate("local")(req, res, function(){
             res.render("home.ejs");
            });
    });
});

// login form for superusers and admins
router.get("/login", function(req, res){
    res.render("login");
});

// login authentication for superusers and admins
router.post("/login", passport.authenticate("local", {
    successRedirect: "/trails",
    failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/trails");
});

// middleware check for login
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

// home page
router.get("/", function(req, res){
    // pull all trails from db
    Trail.find ({}, function(err, allTrails){
        if(err){
            console.log(err);
        } else {
             res.render('home.ejs', {trails:allTrails});
        }
    });
   
});

// error page
router.get("*", function(req, res){
    res.send('404 file not found');
});

module.exports = router;