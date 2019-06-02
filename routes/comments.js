var express   = require("express");

// Here we are using express router insted of app itself.
// Here we have to use mergeParams: true in thr Router as if we not use this, 
// it will not read :id in the campgrounds page when we try to add comment and we will get the error
// cannot read property "name" of null.
var router     = express.Router({mergeParams: true});
var Campground = require("../model/campground"),
    Comment    = require("../model/comments")


// Since a comment is associated with post so we can't directly create route as /comments/new ,
// we have to use a campground id , so the route will be /campground/:id/comments/new.

router.get("/new",isLoggedIn, function(req,res){
    
    // First find the campground with the id in the link and then pass it to the new.ejs
    Campground.findById(req.params.id,function(err,campground){
        if (err) {
            console.log(err)
        }else{
            res.render("comments/new",{campground : campground})        
        }
    })
    
;;})


// Creates comments
router.post("/", isLoggedIn,function(req,res){
    
    // First find the campground using ID, to which the comment will be associated.
    Campground.findById(req.params.id,function(err,campground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            
            // Now create a new comment.
            Comment.create(req.body.comment,function(err,comment){
                if (err) {
                    console.log(err);
                    res.redirect("/campgrounds");
                }else{
                    
                    // Add username and ID to the comment.
                    comment.author.id= req.user._id;
                    comment.author.username= req.user.username;
                    
                    // Save comment
                    comment.save();
                    
                    
                    // Now add comment to the target campground.
                    campground.comments.push(comment);
                    
                    // Now save the campground.
                    campground.save();
                    
                    // Now redirect to show page with the updated comment.
                    res.redirect("/campgrounds/"+campground._id);
                    
                }
            });
        }
    });
});

// Middleware
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports= router;