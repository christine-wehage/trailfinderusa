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
   });
});

app.get("/", function(req, res){
    res.render('home');
});

 var trails = [
        {name: "Acadia National Park", image: "https://www.nps.gov/common/uploads/grid_builder/acad/crop16_9/E6B230A1-DC14-F36A-8E22547BB4C2AA27.jpg?width=950&quality=90&mode=crop"},
        {name: "Ala Kahakai National Historic Trail", image: "https://www.nps.gov/common/uploads/grid_builder/alka/crop16_9/25DE833E-1DD8-B71B-0BC6992DDE05DCDD.jpg?width=950&quality=90&mode=crop"},
        {name: "Appalachian National Scenic Trail", image: "https://www.nps.gov/common/uploads/grid_builder/appa/crop16_9/7439728A-1DD8-B71B-0B90C9CA77A75C7E.jpg?width=950&quality=90&mode=crop"},
        {name: "Arches National Park", image: "https://www.nps.gov/common/uploads/grid_builder/arch/crop16_9/0E80496C-1DD8-B71B-0B8B48F7F4529F52.jpg?width=465&quality=90&mode=crop/"}];
app.get("/trails", function(req, res){
       
    res.render('trailsList', {trails:trails});
});

app.post("/trails", function(req, res){
    var name = req.body.trailName;
    var image = req.body.trailImage;
    var newTrail = {name: name, image: image}
    trails.push(newTrail);
    
    res.redirect("/trails");
    
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