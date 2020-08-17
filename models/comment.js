var mongoose = require("mongoose");
 
var commentSchema = new mongoose.Schema({
    text: String,
    rating: {
        // Setting the field type
        type: Number
    },
    title: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
     // trail comment is associated to
    trail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trail"
    }
}, {
    // assign createdAt and updatedAt fields to schema
    timestamps: true
});
 
module.exports = mongoose.model("Comment", commentSchema);