var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserInput = new Schema({
    user_id : {type:String},
    output :{type : Array},
    counter : {type :Number},
    category : {type:String}
})

module.exports = mongoose.model("UserInput", UserInput);
