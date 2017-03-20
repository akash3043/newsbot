var UserInput = require('./models/userInput');
var sendMessage = require('./sendMessage');
var getNewsTemplates = require('./getNewsTemplates');

module.exports=function getMoreNewsArticles(userId){
  var query = {user_id:userId}
  UserInput.findOne(query, function(err, result){
    if(err){
      sendMessage(userId, {text:"Something wnet wrong. Please try again"});
    }else{
        var counter = result.counter;
        var newsArticles = result.output;
        if(counter===newsArticles.length){
          sendMessage(userId, {text:"No more latest articles in this category. Try again later or read about other category?"})
        }else{
          var newCounter = counter+10<newsArticles.length?counter+10:newsArticles.length;
          var outputArr = newsArticles.slice(counter, newCounter);
          getNewsTemplates(outputArr, userId);
          UserInput.findOneAndUpdate(query, {counter:newCounter}, {upsert:true}, function(err, result){
              if(err){
                  console.log("Database error: "+ err)
              }
          })

        }

    }
  })
}
