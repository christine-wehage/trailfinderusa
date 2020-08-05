var mongoose = require("mongoose");
var Trail = require("./models/trail");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg"
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg"
    }
];
 
function seedDB(){
   //Remove all trails
   Trail.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed trails!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few trails
            data.forEach(function(seed){
                Trail.create(seed, function(err, trail){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a trail");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    trail.comments.push(comment);
                                    trail.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;