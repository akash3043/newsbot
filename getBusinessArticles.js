var async = require('async');
var request = require('request');
var getShuffledArticles = require('./getShuffledArticles');

module.exports=function getBusinessArticles(userId){

      async.parallel([
        function(callback){
            request("https://newsapi.org/v1/articles?source=bloomberg&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
              if(!error&&response.statusCode){
                  var responseObj = JSON.parse(body);
                  var newsArticles = responseObj.articles;
                  callback(null, newsArticles);
              }

            })
        },
        function(callback){
          request("https://newsapi.org/v1/articles?source=business-insider&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
            if(!error&&response.statusCode){
                var responseObj = JSON.parse(body);
                var newsArticles = responseObj.articles;
                callback(null, newsArticles);
            }

          })
        }, function(callback){
            request("https://newsapi.org/v1/articles?source=cnbc&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
              if(!error&&response.statusCode){
                  var responseObj = JSON.parse(body);
                  var newsArticles = responseObj.articles;
                  callback(null, newsArticles);
              }

            })
        },function(callback){
            request("https://newsapi.org/v1/articles?source=financial-times&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
              if(!error&&response.statusCode){
                  var responseObj = JSON.parse(body);
                  var newsArticles = responseObj.articles;
                  callback(null, newsArticles);
              }

            })
          },function(callback){
              request("https://newsapi.org/v1/articles?source=the-wall-street-journal&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
                if(!error&&response.statusCode){
                    var responseObj = JSON.parse(body);
                    var newsArticles = responseObj.articles;
                    callback(null, newsArticles);
                }

              })
            },function(callback){
                request("https://newsapi.org/v1/articles?source=the-economist&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
                  if(!error&&response.statusCode){
                      var responseObj = JSON.parse(body);
                      var newsArticles = responseObj.articles;
                      callback(null, newsArticles);
                  }

                })
              }
      ], function(err, results){
          if(err) {
              console.log("error: "+ err);
          }else{
            getShuffledArticles(results, userId, "business");
          }

      })
  }
