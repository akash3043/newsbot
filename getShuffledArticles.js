var getNewsTemplates = require('./getNewsTemplates');
var storeResultsInDB = require('./storeResultsInDB');

module.exports=function getShuffledArticles(results, userId, category){
    var outputArr = []
    results.forEach(function(element){
        outputArr = outputArr.concat(element);
    })
    outputArr = shuffleArticles(outputArr);
    //console.log(outputArr);
    getNewsTemplates(outputArr, userId);
    storeResultsInDB(category,userId,outputArr)
  function shuffleArticles(results){

        var length  = results.length;
        for(var i=length-1;i>0;i--){
            var j = Math.floor(Math.random()*(i+1));
            var temp = results[i];
            results[i]=results[j];
            results[j] = temp;
        }
        return results;
    }
}
