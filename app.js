var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request")

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/results", function(req, res){
   request('https://developer.nps.gov/api/v1/activities/parks?id=BFF8C027-7C8F-480B-A5F8-CD8CE490BFBA&api_key=MDHpUXvvKO6gPxWpRGGyqhpUfGseSL7ekKqM2par', function(error, response, body){
       if(!error && response.statusCode == 200) {
           var results = JSON.parse(body)
           res.send(results);
       }
   })
})

app.get("/:name", function(req, res){
    var name = req.params.name;
    res.render('home', {name: name});
});


app.post("/addItem", function(req, res){
    res.send("You have reached the post route!")
})

app.get("*", function(req, res){
    res.send('404 file not found');
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started");
});