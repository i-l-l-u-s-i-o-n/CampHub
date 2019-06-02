// All middleware will be written here.

var Campground=require("../model/campground"),
    Comment = require("../model/comments");
var middleObjects = {};


// Middleware for USER authorization.
middleObjects.checkCampgroundOwner =  function(req,res,next){
    
    //If user logged in
    if(req.isAuthenticated()){
        
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               res.redirect("back");
           }  else {
               // Is the same user who posted the campground.
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");   // Redirects to previous page.
    }
}

middleObjects.checkCommentOwner = function(req,res,next){
    
    //If user logged in
    if(req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // Is the same user who posted the campground.
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
           }
        });
    } else {
        res.redirect("back");   // Redirects to previous page.
    }
}

middleObjects.isLoggedIn = function(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = middleObjects;