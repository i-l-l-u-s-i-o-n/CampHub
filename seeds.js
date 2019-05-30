var mongoose=require("mongoose");

var Campgrounds=require("./model/campground");
var Comment=require("./model/comments");

var data=[
        {
            name: "Salmon Creek", 
            image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"
            
        },
        {
            name: "Granite Hill",
            image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"
            
        },
        {
            name: "Mountain Goat's Rest", 
            image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"
            
        }
        ]

function seedDB() {
    
    // Remove all campgrounds.
    Campgrounds.remove({},function(err){
        if (err) {
            console.log(err)
        }else{
            console.log("Campgrounds removed");
            
            // Now add new Campgrounds.
            
            data.forEach(function(campground) {
                Campgrounds.create(campground,function(err,addedCampground){
                    if (err) {
                         console.log(err)
                    }else{
                        
                        console.log("Added a new Campground !!");
                        
                        // Create a comment 
                        
                        Comment.create({
                            text: "This is a awesome place !",
                            author: "Shivam"
                        },function(err,newComment){
                            if (err) {
                                console.log(err)
                            }else{
                                addedCampground.coments.push(newComment);
                                addedCampground.save(); // we can also pass a callback as we normally do.
                                console.log("Created a comment.")
                                
                            }
                        });
                        
                        
                    }
                })
            })
        }
    });
}

module.exports = seedDB;