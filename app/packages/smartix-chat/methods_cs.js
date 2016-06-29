Meteor.methods({


  // 'chat/delete' :function(chatRoomId){
     
  //    var chatToBeDeleted = Smartix.Groups.Collection.findOne(chatRoomId);
  //    //if this chatroom has moderator
  //    if(chatToBeDeleted.admins){
  //        //if current user is the moderatar
  //        if(chatToBeDeleted.admins.indexOf(Meteor.userId()) != -1 ){
  //            //proceed to delete this chatroom
  //            Smartix.Groups.Collection.remove(chatToBeDeleted);
  //        }
  //    }   
  // },
  // 'chat/sendMessage': function (chatRoomId, text) {
  //   var pushObj = {};
  //   pushObj.from = Meteor.userId();
  //   pushObj.sendAt = moment().format('x');
  //   pushObj.text = text;
  //   pushObj.createdAt = new Date();
  //   Smartix.Groups.Collection.update(chatRoomId, {$push: {messagesObj: pushObj}, $set:{lastUpdatedAt:new Date(),lastUpdatedBy:Meteor.userId()}} );
  //   //TODO send email
  //   //Email.send
  //   return pushObj;
  // },

  // 'chat/sendImage': function (chatRoomId, pushObj) {
  //   pushObj.sendAt = moment().format('x');
  //   pushObj.createdAt = new Date(); 
  //   //  var pushObj = {};
  //   //    pushObj.from = Meteor.userId();
  //   //    pushObj.sendAt = moment().format('x');
  //   //    pushObj.text = text;
  //   //todo: change the name of this method to chat/appendMessageObj to reflect its usage
  //   Smartix.Groups.Collection.update(chatRoomId, {$push: {messagesObj: pushObj},$set:{lastUpdatedAt:new Date(),lastUpdatedBy:Meteor.userId()}} );
  //   return pushObj;
  // }
    
});