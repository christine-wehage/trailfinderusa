var mongoose = require("mongoose");

// define schema
var trailSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    location: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
     ],
    rating: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Trail", trailSchema);


