var async = require('async');
var request = require('request');
var getShuffledArticles = require('./getShuffledArticles');
module.exports=function getSportArticles(userId){

      async.parallel([
        function(callback){
            request("https://newsapi.org/v1/articles?source=bbc-sport&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
              if(!error&&response.statusCode){
                  var responseObj = JSON.parse(body);
                  var newsArticles = responseObj.articles;
                  callback(null, newsArticles);
              }

            })
        },
        function(callback){
          request("https://newsapi.org/v1/articles?source=espn&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
            if(!error&&response.statusCode){
                var responseObj = JSON.parse(body);
                var newsArticles = responseObj.articles;
                callback(null, newsArticles);
            }

          })
        }, function(callback){
            request("https://newsapi.org/v1/articles?source=espn-cric-info&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
              if(!error&&response.statusCode){
                  var responseObj = JSON.parse(body);
                  var newsArticles = responseObj.articles;
                  callback(null, newsArticles);
              }

            })
        },function(callback){
            request("https://newsapi.org/v1/articles?source=nfl-news&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
              if(!error&&response.statusCode){
                  var responseObj = JSON.parse(body);
                  var newsArticles = responseObj.articles;
                  callback(null, newsArticles);
              }

            })
          },function(callback){
              request("https://newsapi.org/v1/articles?source=sky-sports-news&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
                if(!error&&response.statusCode){
                    var responseObj = JSON.parse(body);
                    var newsArticles = responseObj.articles;
                    callback(null, newsArticles);
                }

              })
            },function(callback){
                request("https://newsapi.org/v1/articles?source=fox-sports&apiKey=387b12d8c1e74fde941fbb27e7764398", function(error, response, body){
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
            getShuffledArticles(results, userId, "sport");
          }

      })
  }
