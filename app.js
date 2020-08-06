var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require('express-sanitizer');
var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user.js");

var commentsRoutes = require("./routes/comments");
var trailsRoutes = require("./routes/trails");
var indexRoutes = require("./routes/index");

// open db
var mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost/trails");
    
var Trail = require("./models/trail.js");
var Comment = require("./models/comment.js");

var request = require("request");


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(require("express-session")({
    secret: "There is a hint of truth in every lie",
    resave: false,
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/trails/:id/comments", commentsRoutes);
app.use("/trails", trailsRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Trailfinder server has started");
});