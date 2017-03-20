var sendMessage = require('./sendMessage')

module.exports=function getNewsTemplates(result, userId){
 var length = result.length>=10?10:result.length;
  var elements = new Array(length)
  for(var i=0; i<length;i++){
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
