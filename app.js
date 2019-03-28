var express = require("express");
var app=express();
var bodyParser=require("body-parser");

var campgrounds=[
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}    ]

//Using body parser to read data from the parameter send using POST requests.
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs");

app.get("/",function(req,res){
    res.render("home");
});



app.get("/campground",function(req,res){
    res.render("campground",{campgrounds: campgrounds});
});




// This a RESTful convention to use the same name for the routes for different methods.
app.post("/campground",function(req,res){
    //Using body parser to read data from the parameter send using POST requests.
    var name=req.body.name;
    var image=req.body.url;
    
    var newCamp={name: name, image:image};
    campgrounds.push(newCamp);
    res.redirect("campground");   // By default it redirect to the route with get method.
    
})

app.get("/campground/new",function(req,res){
    res.render("new.ejs");
});


// Starting server on c9 port.
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("SERVER STARTED!"); 
});