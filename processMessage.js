var getBusinessArticles = require('./getBusinessArticles');
var getTechnologyArticles = require('./getTechnologyArticles');
var getSportArticles = require('./getSportArticles');
var getCategoryList = require('./getCategoryList');
var getSourcesList = require('./getSourcesList');
var getMoreNewsArticles = require('./getMoreNewsArticles');

module.exports = function processMessage(event){
    if(!event.message.is_echo){
        var message = event.message;
        var senderId = event.sender.id;
        if(message.text){
            var text = message.text;
            if(text==='source'){
              getSourcesList(senderId);
            }else if(text==='category'){
                getCategoryList(senderId);
            }else if(text==='business'){
                getBusinessArticles(senderId);
            }else if(text==='technology'){
                getTechnologyArticles(senderId);
            }else if(text==='sport'){
                getSportArticles(senderId);
            }else if(text==='more'){
                getMoreNewsArticles(senderId);
            }
        }
    }

}
