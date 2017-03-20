var sendMessage= require('./sendMessage');

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





module.exports=function getSourcesList(userId){

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
