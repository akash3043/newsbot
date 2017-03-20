var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var async = require('async');
var UserInput = require("./models/userInput");
var db  = mongoose.connect(process.env.MONGODB_URI);
var processPostback = require('./processPostback');
var processMessage = require('./processMessage');

var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.listen(process.env.PORT||3000);




app.get("/", function(req, res){
    res.send('Deployed');

})

app.get("/webhook", function (req, res) {
    if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
        console.log("Verified webhook");
        res.status(200).send(req.query["hub.challenge"]);
    } else {
        console.error("Verification failed. The tokens do not match.");
        res.sendStatus(403);
    }
});

app.post("/webhook", function (req, res) {
    // Make sure this is a page subscription
    if (req.body.object == "page") {
        // Iterate over each entry
        // There may be multiple entries if batched
        req.body.entry.forEach(function(entry) {
            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.postback) {
                    processPostback(event);
                }else if(event.message){
                    processMessage(event);
                }
            });
        });

        res.sendStatus(200);
    }
});
