Meteor.methods({
    
  setChatMessageAsRead:function(updateNotificationObj){
      log.info("trySetChatMessageAsRead")
      log.info(updateNotificationObj);
      Notifications.update({_id:updateNotificationObj._id},updateNotificationObj);
  },
  setAllChatMessagesAsRead:function(chatRoomId){
      log.info("trySetChatMessagesAsRead")
      log.info(Notifications.update({ "eventType" : "newchatroommessage",chatroomId:chatRoomId,userId:Meteor.userId()},{ $set: { hasRead: true } },{multi:true}));
  },
  setAllClassMessagesAsRead:function(classCode){
      log.info("trySetClassMessagesAsRead");
      var targetClass = Smartix.Groups.Collection.findOne({classCode:classCode});
      if(targetClass){
        log.info(Notifications.update({ "eventType" : "newclassmessage",groupId:targetClass._id,userId:Meteor.userId()},{ $set: { hasRead: true } },{multi:true}));  
      }
  },
  setAllClassCommentsAsRead:function(classCode){
      log.info("trySetClassCommentsAsRead")
      var targetClass = Smartix.Groups.Collection.findOne({classCode:classCode});
      if(targetClass){
        log.info(Notifications.update({ "eventType" : "newclasscomment",groupId:targetClass._id,userId:Meteor.userId()},{ $set: { hasRead: true } },{multi:true}));
      }
  },
  insertNotification:function(notificationObj){
      Notifications.insert(notificationObj);
  }
    
});