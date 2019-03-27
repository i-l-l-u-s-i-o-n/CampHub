var express = require("express");
var app=express();
var bodyParser=require("body-parser");

var campgrounds=[
    {name: "Daisy Mountain" , image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv9n8b2hjD26vxj1jcjSOQk-rgsxZoAvH6LHeUMen7tGOCH6iOww"},
    {name: "HillSide" , image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ1GBCY_MsQLfN1xEJAuwyB1-td-NJINX7x-LjKq0fz2xuQeeL"}
    ]

//Using body parser to read data from the parameter send using POST requests.
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs");

app.get("/",function(req,res){
    res.send("Working !");
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
    res.redirect("campgrounds");   // By default it redirect to the route with get method.
    
})

app.get("/newCampground",function(req,res){
    res.render("new.ejs");
});


// Starting server on c9 port.
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("SERVER STARTED!"); 
});