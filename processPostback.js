
var sendMessage = require('./sendMessage');
var getBusinessArticles = require('./getBusinessArticles');
var getTechnologyArticles = require('./getTechnologyArticles');
var getSportArticles = require('./getSportArticles');
var getCategoryList = require('./getCategoryList');
var getSourcesList = require('./getSourcesList');
var getNewsArticles = require('./getNewsArticles');

module.exports = function processPostback(event){

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
