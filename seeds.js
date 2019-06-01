var mongoose=require("mongoose");

var Campgrounds=require("./model/campground");
var Comment=require("./model/comments");

var data=[
        {
            name: "Salmon Creek", 
            image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
            description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            
        },
        {
            name: "Granite Hill",
            image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
            description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            
        },
        {
            name: "Mountain Goat's Rest", 
            image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg",
            description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            
        }
        ]

function seedDB() {
    
    // Remove all the comments .
    
    Comment.remove({},function(err){
      if (err) {
          console.log(err)
      }  else{
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
                            },function(err, newComment){
                                if (err) {
                                    console.log(err)
                                }else{
                                    addedCampground.comments.push(newComment);
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
    })
    
    
}

module.exports = seedDB;