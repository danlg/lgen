Meteor.methods({


  'chat/delete' :function(chatRoomId){
     
     var chatToBeDeleted = Chat.findOne(chatRoomId);
     //if this chatroom has moderator
     if(chatToBeDeleted.chatRoomModerator){
         //if current user is the moderatar
         if(chatToBeDeleted.chatRoomModerator == Meteor.userId()){
             //proceed to delete this chatroom
             Chat.remove(chatToBeDeleted);
         }
     }   
  },
  'chat/sendMessage': function (chatRoomId, text) {
    var pushObj = {};
    pushObj.from = Meteor.userId();
    pushObj.sendAt = moment().format('x');
    pushObj.text = text;
    pushObj.createdAt = new Date();
    Chat.update(chatRoomId, {$push: {messagesObj: pushObj}, $set:{lastUpdatedAt:new Date(),lastUpdatedBy:Meteor.userId()}} );
    //TODO send email
    //Mandrill.messages.send
    
    return pushObj;
  },

  'chat/sendImage': function (chatRoomId, pushObj) {
    pushObj.sendAt = moment().format('x');
    pushObj.createdAt = new Date(); 
    //  var pushObj = {};
    //    pushObj.from = Meteor.userId();
    //    pushObj.sendAt = moment().format('x');
    //    pushObj.text = text;
    //todo: change the name of this method to chat/appendMessageObj to reflect its usage
    Chat.update(chatRoomId, {$push: {messagesObj: pushObj},$set:{lastUpdatedAt:new Date(),lastUpdatedBy:Meteor.userId()}} );
    return pushObj;
  },    
    
});