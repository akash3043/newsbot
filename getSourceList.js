var request = require('request');
var sendMessage = require('./sendMessage');

module.exports = function getSourceList(category, userId){
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
