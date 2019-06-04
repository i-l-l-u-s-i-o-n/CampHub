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
               req.flash("error" ,"Something went wrong!")
               res.redirect("back");
           }  else {
               // Is the same user who posted the campground.
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error" ,"You don't have permission to do that!")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error" , "You must be logged in !")
        res.redirect("back");   // Redirects to previous page.
    }
}

middleObjects.checkCommentOwner = function(req,res,next){
    
    //If user logged in
    if(req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               req.flash("error" ,"Something went wrong!")
               res.redirect("back");
           }  else {
               // Is the same user who posted the campground.
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error" ,"You don't have permission to do that!")
                    res.redirect("back");
                }
           }
        });
    } else {
        req.flash("error" , "You must be logged in !")
        res.redirect("back");   // Redirects to previous page.
    }
}

middleObjects.isLoggedIn = function(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    
    // Here we are using flash message . It takes parameter as key value pair.
    // It will be displayed on the nect page . So we have to pass req.flash("error") to the login page.     
    req.flash("error", "You must be logged in!");

    res.redirect("/login");
}

module.exports = middleObjects;