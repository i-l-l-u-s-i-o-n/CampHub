var express  = require("express");

// Here we are using express router insted of app itself.
var router   = express.Router();

var passport = require("passport"),
    User     = require("../model/user");

// Root route    
router.get("/",function(req,res){
    res.render("campgrounds/home");
});

// Show signup form
router.get("/register",function(req,res){
    res.render("register");
})

// Sign Up logic
router.post("/register",function(req,res){
    
    var newUser=new User({username: req.body.username});
    
    // Following allows to add password in a HASHED format. i.e a salt and a hash value.
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err)
            return res.render("/register");
        }
        passport.authenticate("local")(req,res, function(){
            res.redirect("/campgrounds")
        });
    });
});

// Show login form
router.get("/login",function(req,res){
    res.render("login");
})

// Login logic 
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req,res){
});


// Logout route 
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds");
})

// Custom middleware

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports= router;