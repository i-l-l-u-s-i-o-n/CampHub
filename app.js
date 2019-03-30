// Including the required packages.
var express     = require("express"),
    app         =express(),
    bodyParser  =require("body-parser"),
    mongoose    = require("mongoose");
    
    
    
//Using body parser to read data from the parameter send using POST requests.
app.use(bodyParser.urlencoded({extended:true}))

// Doing this will consider all the file to be rendered as EJS(embedded JS)
app.set("view engine","ejs");



// Connecting to Mongo DB using mongoose.
mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true })


// Schema SETUP

var campgroundSchema =new mongoose.Schema({
    name:String,
    image:String
});


// Compiling schema into MODEL to use various methods.
var Campground=mongoose.model("Campground",campgroundSchema);

// Adding campgrounds to database.

Campground.create(
    {
        name:"Salmon Creek",
        image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"
    },  function(err,campground){
            if(err){
                console.log("Can't add capmground"+ err);
            }else{
                console.log("Successfully added campground !");
                console.log(campground);
            }
    })




// var campgrounds=[
//     {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}    ]
        
        
app.get("/",function(req,res){
    res.render("home");
});





app.get("/campground",function(req,res){
    
    // Retrieving Campgrounds from database
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("Can't retrieve!"+err);
        }else{
            res.render("campground",{campgrounds: allCampgrounds});
        }
    })
    
});




// This a RESTful convention to use the same name for the routes for different methods.
app.post("/campground",function(req,res){
    //Using body parser to read data from the parameter send using POST requests.
    var name=req.body.name;
    var image=req.body.url;
    
    var newCamp={name: name, image:image};
    
    // Adding new Campground.
    Campground.create(newCamp, function(err,camp){
        if (err) {
            console.log("Can't add campground !" + err);
        }else{
            console.log("Successfully added ! "+ camp);
            res.redirect("campground");   // By default it redirect to the route with get method.
        }
    })
    // campgrounds.push(newCamp);
    
    
})

app.get("/campground/new",function(req,res){
    res.render("new.ejs");
});


// Starting server on c9 port.
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("SERVER STARTED!"); 
});