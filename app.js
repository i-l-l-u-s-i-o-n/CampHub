
// Created by Shivam Shukla.

// Including the required packages.
var express     = require("express"),
    app         =express(),
    bodyParser  =require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy  =require ("passport-local"),
    User         = require("./model/user"),
    Campground  =require("./model/campground"),
    seedDB     =require("./seeds"),
    Comment    =require("./model/comments");
    
    
    
//Using body parser to read data from the parameter send using POST requests.
app.use(bodyParser.urlencoded({extended:true}))

// Doing this will consider all the file to be rendered as EJS(embedded JS)
app.set("view engine","ejs");


//Using public directory
app.use(express.static(__dirname + "/public"));
// __dirname specifies the path where our main script(app.js) is located.




// Connecting to Mongo DB using mongoose.
mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true })
        
  
  
seedDB();  

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



      
// ================================================================================================================================ //
//                                                  RESTFUL ROUTES                                                                  //
// ================================================================================================================================ //


      
      
app.get("/",function(req,res){
    res.render("campgrounds/home");
});




// INDEX route- GET method , shows content  
app.get("/campgrounds",function(req,res){
    
    

    
    
    // Retrieving Campgrounds from database
    console.log(req.user)
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("Can't retrieve!"+err);
        }else{
            res.render("campgrounds/index",{campgrounds: allCampgrounds});
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
    res.render("campgrounds/new.ejs");
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
            res.render("campgrounds/show", {campground: foundCapmground});
        }
    });
})

/////////////////////////////////////////////////     COMMENTS ROUTES         //////////////////////////////////////////////////////////////////////////////////////////////////


// Since a comment is associated with post so we can't directly create route as /comments/new ,
// we have to use a campground id , so the route will be /campground/:id/comments/new.

app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req,res){
    
    // First find the campground with the id in the link and then pass it to the new.ejs
    Campground.findById(req.params.id,function(err,campground){
        if (err) {
            console.log(err)
        }else{
            res.render("comments/new",{campground : campground})        
        }
    })
    
;;})



app.post("/campgrounds/:id/comments", isLoggedIn,function(req,res){
    
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
                    
                    // Now add comment to the target campground.
                    campground.comments.push(comment);
                    
                    // Now save the campground.
                    campground.save();
                    
                    // Now redirect to show page with the updated comment.
                    res.redirect("/campgrounds/"+campground._id);
                    
                }
            })
            
            
        }
    })
})


// =======================================================================================================================  //
// Auth routes 

app.get("/register",function(req,res){
    res.render("register");
})

// Sign Up logic
app.post("/register",function(req,res){
    
    var newUser=new User({username: req.body.username});
    
    // Following allows to add password in a HASHED format. i.e a salt and a hash value.
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err)
            return res.render("/register");
        }
        passport.authenticate("local")(req,res, function(){
            res.redirect("/campgrounds")
        })
    })
})


// Login route

// Show login form
app.get("/login",function(req,res){
    res.render("login");
})

// Login logic 
app.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req,res){
});


// Logout route 
app.get("/logout", function(req,res){
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

// Starting server on c9 port.
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("SERVER STARTED!"); 
});