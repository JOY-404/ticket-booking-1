const express = require("express"); //importing express
const mongoose = require("mongoose"); //to connect node.js env with MongoDB
const bodyParser = require("body-parser"); //to convert post data into request body
const ticketController = require("./controllers/ticket");

mongoose.set('useUnifiedTopology', true); //for the warning

const application = express(); //creating express application

//configuration on express application 
application.use(bodyParser.json()); // tells the system that we want json to be used

mongoose.connect("mongodb://localhost:27017/Bus", { useNewUrlParser: true }, (error)=>{ 
    if(!error){
        console.log("Successfully Connected to DB");
    }
    else{
        console.log("Error Connecting to DB");
    }
});

//set application to send or handle root url
application.get("/", (req, res)=>{
    res.send("<h1>WELCOME</h1>")
});

application.use("/bus", ticketController);

application.listen("3000", ()=>{ //server for express
    console.log("Server Started");
});