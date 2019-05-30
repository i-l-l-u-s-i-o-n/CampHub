var mongoose=require("mongoose");

var commentSchema=new mongoose.Schema({
    text : String,
    author: String
});

var comments=mongoose.model("Comment",commentSchema);

module.exports = comments;