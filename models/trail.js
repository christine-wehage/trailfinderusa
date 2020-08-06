var mongoose = require("mongoose");

// define schema
var trailSchema = new mongoose.Schema({
    name: String,
    image: String,
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
        ]
});

module.exports = mongoose.model("Trail", trailSchema);