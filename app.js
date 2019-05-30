
// Created by Shivam Shukla.

// Including the required packages.
var express     = require("express"),
    app         =express(),
    bodyParser  =require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  =require("./model/campground"),
    seedDB     =require("./seeds"),
    Comment    =require("./model/comments");
    
    
    
//Using body parser to read data from the parameter send using POST requests.
app.use(bodyParser.urlencoded({extended:true}))

// Doing this will consider all the file to be rendered as EJS(embedded JS)
app.set("view engine","ejs");


seedDB();

// Connecting to Mongo DB using mongoose.
mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true })
        
      
      
// ================================================================================================================================ //
//                                                  RESTFUL ROUTES                                                                  //
// ================================================================================================================================ //


      
      
app.get("/",function(req,res){
    res.render("home");
});




// INDEX route- GET method , shows content  
app.get("/campgrounds",function(req,res){
    
    // Retrieving Campgrounds from database
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("Can't retrieve!"+err);
        }else{
            res.render("index",{campgrounds: allCampgrounds});
        }
    })
    
});




// This a RESTful convention to use the same name for the routes for different methods.

// CREATE route - POST method, adds new campground.
app.post("/campgrounds",function(req,res){
    //Using body parser to read data from the parameter send using POST requests.
    var name=req.body.name;
    var image=req.body.url;
    var decription=req.body.description;
    
    var newCamp={name: name, image:image, description:decription};
    
    // Adding new Campground.
    Campground.create(newCamp, function(err,camp){
        if (err) {
            console.log("Can't add campground !" + err);
        }else{
            console.log("Successfully added ! "+ camp);
            res.redirect("/campgrounds");   // By default it redirect to the route with get method.
        }
    })
    // campgrounds.push(newCamp);
    
    
})


// NEW route - GET method, Display form to add new campground.
app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});



// This route must be below the "/campground/new" else this will also be considered as "/camground/:id".

// SHOW route - GET method, Shows info. about clicked campground.
app.get("/campgrounds/:id",function(req,res){
    
    
    // First we have to find the campground with corresponding ID.
    // Mongoose provide a method for finding record with ID, OR we can simply use find({condition}).
    
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCapmground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCapmground);
            res.render("show", {campground: foundCapmground});
        }
    });
})




// Starting server on c9 port.
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("SERVER STARTED!"); 
});