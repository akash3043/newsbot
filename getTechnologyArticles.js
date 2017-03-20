var async = require('async');
var request = require('request');
var getShuffledArticles = require('./getShuffledArticles');

module.exports=function getTechnologyArticles(userId){

      async.parallel([
        function(callback){
            request("https://newsapi.org/v1/articles?source=techcrunch&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
              if(!error&&response.statusCode){
                  var responseObj = JSON.parse(body);
                  var newsArticles = responseObj.articles;
                  callback(null, newsArticles);
              }

            })
        },
        function(callback){
          request("https://newsapi.org/v1/articles?source=techradar&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
            if(!error&&response.statusCode){
                var responseObj = JSON.parse(body);
                var newsArticles = responseObj.articles;
                callback(null, newsArticles);
            }

          })
        }, function(callback){
            request("https://newsapi.org/v1/articles?source=hacker-news&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
              if(!error&&response.statusCode){
                  var responseObj = JSON.parse(body);
                  var newsArticles = responseObj.articles;
                  callback(null, newsArticles);
              }

            })
        },function(callback){
            request("https://newsapi.org/v1/articles?source=the-next-web&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
              if(!error&&response.statusCode){
                  var responseObj = JSON.parse(body);
                  var newsArticles = responseObj.articles;
                  callback(null, newsArticles);
              }

            })
          },function(callback){
              request("https://newsapi.org/v1/articles?source=the-verge&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
                if(!error&&response.statusCode){
                    var responseObj = JSON.parse(body);
                    var newsArticles = responseObj.articles;
                    callback(null, newsArticles);
                }

              })
            },function(callback){
                request("https://newsapi.org/v1/articles?source=engadget&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
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
            getShuffledArticles(results, userId, "technology");
          }

      })
  }
