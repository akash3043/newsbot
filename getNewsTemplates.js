var sendMessage = require('./sendMessage')

module.exports=function getNewsTemplates(result, userId){

  var elements = new Array(10)
  for(var i=0; i<result.length&&i<10;i++){
    elements[i]={
      title : result[i].title,
      subtitle : result[i].description.substring(0,80),
      image_url:result[i].urlsToImage,
      buttons: [
              {
                  "title": "Read More",
                  "type": "web_url",
                  "url":result[i].url,

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

}
