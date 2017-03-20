var UserInput = require('./models/userInput')

module.exports=function storeResultsInDB(category, userId, results){

  var query = {user_id : userId}
  var update = {
      user_id:userId,
      output:results,
      category:category,
      counter : results.length>10?10:results.length
  }
  var options = {upsert:true};
  UserInput.findOneAndUpdate(query, update,options, function(err, result){
      if(err){
          console.log("Database error: "+ err);
      }
  })

}
