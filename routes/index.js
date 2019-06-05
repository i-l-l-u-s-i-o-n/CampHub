var express  = require("express");

// Here we are using express router insted of app itself.
var router   = express.Router();

var passport            = require("passport"),
    User                = require("../model/user"),
    async               = require("async"),
    nodemailer          = require("nodemailer"),
    crypto              = require("crypto");

// Root route    
router.get("/",function(req,res){
    res.render("landing");
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
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success", "Welcome to YelpCamp "+ user.username );
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
    req.flash("success" , "Successfully Logged Out !")
    res.redirect("/campgrounds");
})


// Password Forgot
router.get("/forgot",function(req,res){
    res.render("forgot");
})

module.exports= router;