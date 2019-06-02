
// Created by Shivam Shukla.

// Including the required packages.
var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    LocalStrategy       = require ("passport-local"),
    User                = require("./model/user"),
    Campground          = require("./model/campground"),
    seedDB              = require("./seeds"),
    Comment             = require("./model/comments");
    
    
var commentRoutes       = require("./routes/comments"),
    campgroundsRoutes   = require("./routes/campgrounds"),
    authRoutes          = require("./routes/index");
    
    
//Using body parser to read data from the parameter send using POST requests.
app.use(bodyParser.urlencoded({extended:true}))

// Doing this will consider all the file to be rendered as EJS(embedded JS)
app.set("view engine","ejs");


//Using public directory
app.use(express.static(__dirname + "/public"));
// __dirname specifies the path where our main script(app.js) is located.


// Connecting to Mongo DB using mongoose.
mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true })
        
  
  
// seedDB();  // Seeds the database

// PASSPORT CONFIGURATION ->>>>>>>>>>>>>>>>

app.use(require("express-session")({
    secret: "Let the success make the noise!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// We have all the data about user in the "req.user".
// The PASSPORT put the username and ID to the user object ......
    
// So we can pass the user object to out ejs files to display username or for some other stuff.
// { _id: 5cf2587bf8bb5c09810b1cdc, username: 'Shivam', __v: 0 }
// Instead of passing req.user to all the routes , we can simplt create following middleware.

app.use(function(req,res,next){
    res.locals.currentUser= req.user;
    next();  // Next specifies to continue execution which is mostly route handeling(the callbacks).
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.use("/",authRoutes);

// Since all the routes in the campground.js starts with /campground, so we can reduce the route by passing the common part to app.use().
// Now instead of "/campgrounds" in campgrounds.js, just use "/".
app.use("/campgrounds",campgroundsRoutes);

app.use("/campgrounds/:id/comments",commentRoutes);


// Starting server on c9 port.
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("SERVER STARTED!"); 
});