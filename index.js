var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var async = require('async');

var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.listen(process.env.PORT||3000);

var sourcesList = {
  business : [
    [{
      title :"Bloomberg",
      id:"bloomberg"
    }, {
      title :"Business Insider",
      id:"business-insider"
    }, {
      title :"CNBC",
      id:"cnbc"
    }],
    [{
      title :"Financial Times",
      id:"financial-times"
    },{
      title :"The Economist",
      id:"the-economist"
    },{
      title :"The Wall Street Journal",
      id:"the-wall-street-journal"
    }]
  ],
  technology : [
    [{
      title :"Hacker News",
      id:"hacker-news"
    }, {
      title :"TechCrunch",
      id:"techcrunch"
    }, {
      title :"TechRadar",
      id:"techradar"
    }],
    [{
      title :"The Next Web",
      id:"the-next-web"
    },{
      title :"The Verge",
      id:"the-verge"
    },{
      title :"Engadget",
      id:"engadget"
    }]
  ],
  sport : [
    [{
      title :"BBC Sport",
      id:"bbc-sport"
    }, {
      title :"ESPN",
      id:"espn"
    }, {
      title :"ESPN Cric Info",
      id:"espn-cric-info"
    }],
    [{
      title :"Fox Sports",
      id:"fox-sports"
    },{
      title :"NFL News",
      id:"nfl-news"
    },{
      title :"Sky Sports News",
      id:"sky-sports-news"
    }]
  ]
}


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
      };

        sendMessage(senderId, greetings);

        var message ={
                attachment : {
                    type : "template",
                    payload:{
                      template_type:"button",
                      text : "Select one of the options below to start",
                      buttons : [{
                            type:"postback",
                            title:"Select Category",
                            payload:"Category"
                          }, {
                            type:"postback",
                            title:"Select Source",
                            payload:"Source"
                          }]
                    }
                }
            };

    sendMessage(senderId, message);
  }else if(payload==="Business"){
    getBusinessArticles(senderId);

  }else if(payload==="Technology"){
    getTechnologyArticles(senderId);

  }else if(payload==="Sport"){
    getSportArticles(senderId);

  }else if(payload==="Category"){
     getCategoryList(senderId);

  }else if(payload==="Source"){

    getSourcesList(senderId);

  }else{
    getNewsArticles(payload, senderId)
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
    request("https://newsapi.org/v1/articles?apiKey=387b12d8c1e74fde941fbb27e7764398&source="+source, function(error, response, body){
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
                                "title": "More on "+newsObj.source,
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
            var text = message.text;
            if(text==='source'){
              getSourcesList(senderId);
            }else if(text==='category'){
                getCategoryList(senderId);
            }
        }
    }

}

function getCategoryList(userId){

  var message ={
          attachment : {
              type : "template",
              payload:{
                template_type:"button",
                text : "Which category you would like to read about?",
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

sendMessage(userId, message);

}

function getSourcesList(userId){

  var length =sourcesList.business.length+sourcesList.technology.length+sourcesList.sport.length;

 var elements = new Array(length);
 var index = 0;
 for(var i=0; i<sourcesList.business.length;i++){
     elements[index] = {
       title : "Business",
       buttons : [
         {
           "title" : sourcesList.business[i][0].title,
           "type" : "postback",
           "payload": sourcesList.business[i][0].id
         },{
           "title" : sourcesList.business[i][1].title,
           "type" : "postback",
           "payload": sourcesList.business[i][1].id
         },{
           "title" : sourcesList.business[i][2].title,
           "type" : "postback",
           "payload": sourcesList.business[i][2].id
         }]
     }

     index = index+1;
 }

 for(var i=0; i<sourcesList.technology.length;i++){
     elements[index] = {
       title : "Technology",
       buttons : [
         {
           "title" : sourcesList.technology[i][0].title,
           "type" : "postback",
           "payload": sourcesList.technology[i][0].id
         },{
           "title" : sourcesList.technology[i][1].title,
           "type" : "postback",
           "payload": sourcesList.technology[i][1].id
         },{
           "title" : sourcesList.technology[i][2].title,
           "type" : "postback",
           "payload": sourcesList.technology[i][2].id
         }]
     }

     index = index+1;
 }

 for(var i=0; i<sourcesList.sport.length;i++){
     elements[index] = {
       title : "Sports",
       buttons : [
         {
           "title" : sourcesList.sport[i][0].title,
           "type" : "postback",
           "payload": sourcesList.sport[i][0].id
         },{
           "title" : sourcesList.sport[i][1].title,
           "type" : "postback",
           "payload": sourcesList.sport[i][1].id
         },{
           "title" : sourcesList.sport[i][2].title,
           "type" : "postback",
           "payload": sourcesList.sport[i][2].id
         }]
     }

     index = index+1;
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

function getBusinessArticles(userId){

    async.parallel({
      techcrunch:function(callback){
          request("https://newsapi.org/v1/articles?source=techcrunch&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
            if(!error&&response.statusCode){
                var responseObj = JSON.parse(body);
                var newsArticles = responseObj.articles;
                callback('null', newsArticles);
            }

          })
      },
      techradar:function(callback){
        request("https://newsapi.org/v1/articles?source=techradar&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
          if(!error&&response.statusCode){
              var responseObj = JSON.parse(body);
              var newsArticles = responseObj.articles;
              callback('null', newsArticles);
          }

        })
      }
    }, function(err, results){
        if(err) {
            sendMessage(userId, {text:"Something went wrong. Please try again"})
            console.log(err);
        }
        console.log(results);
    })
}
