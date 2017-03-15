var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

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
                }
            });
        });

        res.sendStatus(200);
    }
});

function processPostback(event){

    var senderId = event.sender.id;
    var payload = event.postback.payload;
    if (payload === "Greeting") {
        // Get user's first name from the User Profile API
        // and include it in the greeting
        //persistentMenu(senderId);
          var message = {
                attachment : {
                    type : "template",
                    payload:{
                      template_type:"button",
                      text : "Select the category you want to read about?",
                      buttons : [{
                            type:"postback",
                            title:"Business",
                            payload:"Business"
                          },{
                            type:"postback",
                            title:"Entertainment",
                            payload:"Entertainment"
                          },{
                            type:"postback",
                            title:"Gaming",
                            payload:"Gaming"
                          },{
                            type:"postback",
                            title:"General",
                            payload:"General"
                          },{
                            type:"postback",
                            title:"Music",
                            payload:"Music"
                          }, {
                            type:"postback",
                            title:"Science-and-Nature",
                            payload:"Science-and-Nature"
                          },{
                            type:"postback",
                            title:"Sport",
                            payload:"Sport"
                          },{
                            type:"postback",
                            title:"Technology",
                            payload:"Technology"
                        }]
                    }
                }
            };
    sendMessage(senderId, message);
    }
}


function sendMessage(recipientId, message) {
    console.log("hi");
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: "POST",
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log("Error sending message: " + response.error);
        }
    });
}
