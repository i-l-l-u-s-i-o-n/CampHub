
var mongoose=require("mongoose");

var campgroundSchema =new mongoose.Schema({
    name:String,
    price : String,
    image:String,
    description: String,
    createdAt: { type: Date, default: Date.now },

    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
        ],
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String
    }
});


// Compiling schema into MODEL to use various methods.
var Campground=mongoose.model("Campground",campgroundSchema);

module.exports= Campground;