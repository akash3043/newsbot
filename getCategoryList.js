module.exports=function getCategoryList(userId){

  var message ={
          attachment : {
              type : "template",
              payload:{
                template_type:"button",
                text : "Which category you would like to read about?",
                buttons : [{
                      type:"postback",
                      title:"Business",
                      payload:"Business"
                    }, {
                      type:"postback",
                      title:"Sport",
                      payload:"Sport"
                    },{
                      type:"postback",
                      title:"Technology",
                      payload:"Technology"
                    }]
              }
          }
      };
