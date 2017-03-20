var request = require('request');
var getNewsTemplates = require('./getNewsTemplates');
var sendMessage = require('./sendMessage');


module.exports=function getNewsArticles(source, userId ){
    request("https://newsapi.org/v1/articles?apiKey=387b12d8c1e74fde941fbb27e7764398&source="+source, function(error, response, body){
        if(!error&&response.statusCode===200){
            var newsObj = JSON.parse(body);
            if(newsObj.status==='ok'){
                var articlesArr = newsObj.articles
                getNewsTemplates(articlesArr, userId)


            }else{
                sendMessage(userId,{text:"Something went wrong. Please try again"})
            }
        }else{
            sendMessage(userId,{text:"Something went wrong. Please try again"})
        }
    })
}
