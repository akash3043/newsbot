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
                }else if(event.message){
                    processMessage(event);
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

      var greetings ={

        text:"Hi, Welcome to 'News on the Go' Bot. Select the category or the news source to get the top news articles currently. Category return top news articles from multiple resources and news source returns the top articles published on that specific platform. You can also access category or news source options from 'menu' button on the left of text box. So, Lets read some news "
        },

        sendMessage(senderId, greetings);

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
  }else if(payload==="Business"){

      getSourceList("business", senderId)
  }else if(payload==="Technology"){
      getSourceList("technology", senderId)

  }else if(payload==="Sport"){
    getSourceList("sport", senderId)

  }else{
      console.log(payload);
      getNewsArticles(payload, senderId);
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
//console.log("https://newsapi.org/v1/sources?language=en&apiKey=387b12d8c1e74fde941fbb27e7764398&category="+category);
    request("https://newsapi.org/v1/sources?language=en&apiKey=387b12d8c1e74fde941fbb27e7764398&category="+category, function(error, response, body){
        if(!error&&response.statusCode===200){
          //console.log("request passed")
            var sourceObj = JSON.parse(body);
            if(sourceObj.status==='ok'){
                var sourcesArr = sourceObj.sources;
                //console.log(sourcesArr);
                //console.log(sourcesArr.length);
                var elements = new Array(sourcesArr.length);
                for(var i=0; i<sourcesArr.length&&i<10;i++){
                  elements[i]={
                    title : sourcesArr[i].name,
                    subtitle : sourcesArr[i].description.substring(0,80),
                    image_url:sourcesArr[i].urlsToLogos.small,
                    buttons: [
                            {
                                "title": "Get top news",
                                "type": "postback",
                                "payload":sourcesArr[i].id,

                            }
                        ]
                  }

                  //console.log(elements);



                }
                var message = {
                    attachment :{
                        type:"template",
                        payload:{
                            template_type:"generic",
                            image_aspect_ratio:"square",
                            elements:elements,
                        }
                    }
                };
                  sendMessage(userId, message)
            }else{
                sendMessage(userId,{text:"Something went terribly wrong. Please try again"})
            }
        }else{
            sendMessage(userId,{text:"Something went wrong. Please try again"})
        }
    })
}

function getNewsArticles(source, userId ){
    request("https://newsapi.org/v1/articles?sortBy=top&apiKey=387b12d8c1e74fde941fbb27e7764398&source="+source, function(error, response, body){
        if(!error&&response.statusCode===200){
            var newsObj = JSON.parse(body);
            if(newsObj.status==='ok'){
                var articlesArr = newsObj.articles
                var elements = new Array(articlesArr.length)
                for(var i=0; i<articlesArr.length&&i<10;i++){
                  elements[i]={
                    title : articlesArr[i].title,
                    subtitle : articlesArr[i].description.substring(0,80),
                    image_url:articlesArr[i].urlsToImage,
                    buttons: [
                            {
                                "title": "Read More",
                                "type": "web_url",
                                "url":articlesArr[i].url,

                            }
                        ]
                  }



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



            }else{
                sendMessage(userId,{text:"Something went wrong. Please try again"})
            }
        }else{
            sendMessage(userId,{text:"Something went wrong. Please try again"})
        }
    })
}

function processMessage(event){
    if(!event.message.is_echo){
        var message = event.message;
        var senderId = event.sender.id;
        if(message.text){
            console.log("hi");
        }
    }

}
