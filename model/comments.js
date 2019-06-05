var mongoose=require("mongoose");

var commentSchema=new mongoose.Schema({
    text : String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
});

var comments=mongoose.model("Comment",commentSchema);

module.exports = comments;