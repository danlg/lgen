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
      log.info("trySetClassMessagesAsRead")
      log.info(Notifications.update({ "eventType" : "newclassmessage",classCode:classCode,userId:Meteor.userId()},{ $set: { hasRead: true } },{multi:true}));
  },
  setAllClassCommentsAsRead:function(classCode){
      log.info("trySetClassCommentsAsRead")
      log.info(Notifications.update({ "eventType" : "newclasscomment",classCode:classCode,userId:Meteor.userId()},{ $set: { hasRead: true } },{multi:true}));
  },
  insertNotification:function(notificationObj){
      Notifications.insert(notificationObj);
  }
    
});