      
var express= require("express");

// Here we are using express router insted of app itself.
var router = express.Router();

var Campground=require("../model/campground");
var middleware = require("../middleware/index.js");

// INDEX route- GET method , shows content  
router.get("/",function(req,res){
    // Retrieving Campgrounds from database
    console.log(req.user);
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("Can't retrieve!"+err);
        }else{
            res.render("campgrounds/index",{campgrounds: allCampgrounds});
        }
    });
    
});




// This a RESTful convention to use the same name for the routes for different methods.

// CREATE route - POST method, adds new campground.
router.post("/",isLoggedIn,function(req,res){
    //Using body parser to read data from the parameter send using POST requests.
    var name=req.body.name;
    var image=req.body.url;
    var decription=req.body.description;
    var author= { id: req.user._id, username:req.user.username};
    
    var newCamp={name: name, image:image, description:decription, author: author};
    
    // Adding new Campground.
    Campground.create(newCamp, function(err,camp){
        if (err) {
            console.log("Can't add campground !" + err);
        }else{
            console.log("Successfully added ! "+ camp);
            res.redirect("/campgrounds");   // By default it redirect to the route with get method.
        }
    });
});


// NEW route - GET method, Display form to add new campground.
router.get("/new",isLoggedIn, function(req,res){
    res.render("campgrounds/new.ejs");
});



// This route must be below the "/campground/new" else this will also be considered as "/camground/:id".

// SHOW route - GET method, Shows info. about clicked campground.
router.get("/:id",function(req,res){
    // First we have to find the campground with corresponding ID.
    // Mongoose provide a method for finding record with ID, OR we can simply use find({condition}).
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCapmground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCapmground);
            res.render("campgrounds/show", {campground: foundCapmground});
        }
    });
})

// Edit Campground route
router.get("/:id/edit", middleware.checkCampgroundOwner,function(req, res) {
    
    // Find campground
    Campground.findById(req.params.id,function(err,foundCamp){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit",{camp: foundCamp});
        }
    });

});

router.put("/:id", middleware.checkCampgroundOwner,function(req,res){
    //Find and update the correct campground.
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,camp){
        if (err) {
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});


// DESTROY campground route.

router.delete("/:id", middleware.checkCampgroundOwner,function(req,res){
    
    // Find and delete the campground
    Campground.findByIdAndRemove(req.params.id,function(err){
        if (err) {
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds")
        }
    })
});

// Middleware
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}





module.exports= router;