var express = require("express");
var app=express();

app.get("/",function(req,res){
    res.send("Working !");
});

app.get("/campground",function(req,res){
    res.send("CAMPGROUND !")
})
app.listen(process.env.IP, process.env.PORT,function(){
    console.log("Server STARTED !");
});