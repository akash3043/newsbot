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

        var message ={
                attachment : {
                    type : "template",
                    payload:{
                      template_type:"button",
                      text : "Select the category you want to read about?",
                      buttons : [{
                            type:"postback",
                            title:"Business",
                            payload:"Business"
                          }, {
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

function getSourceList(category, userId){

    request("https://newsapi.org/v1/sources?language=en&apiKey=387b12d8c1e74fde941fbb27e7764398&category="+category, function(error, response, body){
        if(!error&&response.status==='ok'){
            var sourceObj = JSON.parse(body);
            var sourcesArr = sourceObj.sources;
            var elements = new Array(sourcesArr.length);
            for(var i=0; i<sourcesArr.length;i++){
              elements[i]={
                title : sourcesArr[i].name,
                subtitle : sourcesArr[i].description.split(0,80),
                image_url:sourcesArr[i].urlsToLogos.large,
                    "buttons": [
                        {
                            "title": "Get top news",
                            "type": "postback",
                            "payload":sourcesArr[i].id,

                        }
                    ]
              }

              var message = {
                  attachment :{
                      type:"template",
                      payload:{
                          template_type:"generic",
                          elements:elements,
                      }
                  }
              };
              sendMessage(userId, message)
            }

        }
    })
}
