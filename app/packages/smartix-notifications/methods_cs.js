Meteor.methods({
    
  setChatMessageAsRead:function(updateNotificationObj){
      //log.info("trySetChatMessageAsRead");
      //log.info(updateNotificationObj);
      Notifications.update({_id:updateNotificationObj._id},updateNotificationObj);
  },
  setAllChatMessagesAsRead:function(chatRoomId){
      //log.info("trySetChatMessagesAsRead");
      Notifications.update(
          { "eventType" : "newchatmessage",groupId:chatRoomId,userId:Meteor.userId()},
          { $set: { hasRead: true } },{multi:true})
  },
  setAllClassMessagesAsRead:function(classCode){
      //log.info("setAllClassMessagesAsRead");
      var targetClass = Smartix.Groups.Collection.findOne({classCode:classCode});
      if(targetClass){
        Notifications.update({ "eventType" : "newclassmessage",groupId:targetClass._id,userId:Meteor.userId()},{ $set: { hasRead: true } },{multi:true})
      }
  },
  setAllClassCommentsAsRead:function(classCode){
      //log.info("setAllClassCommentsAsRead");
      var targetClass = Smartix.Groups.Collection.findOne({classCode:classCode});
      if(targetClass){
        Notifications.update(
            { "eventType" : "newclasscomment",groupId:targetClass._id,userId:Meteor.userId()}
            ,{ $set: { hasRead: true } },{multi:true})
      }
  },
  setAllNewsAsRead:function(currentSchool){
    //log.info("setAllNewsAsRead");
    Notifications.update(
        { "eventType" : "newnewsgroupmessage",userId:Meteor.userId(),namespace:currentSchool}
        ,{ $set: { hasRead: true } },{multi:true});
      
  },
  setAttendanceAsRead:function(currentSchool,subType){
    var updateCount = Notifications.update(
        { "eventType" : "attendance",eventSubType:subType,userId:Meteor.userId(),namespace:currentSchool}
        ,{ $set: { hasRead: true } },{multi:true});  
    console.log('setAttendanceAsRead:updateCount',updateCount );  
  }, 
  insertNotification:function(notificationObj){
      Notifications.insert(notificationObj);
  },
  setNotificationAsRead:function(notificationId){
    Notifications.update(
        { "_id" : notificationId,userId:Meteor.userId()}
        ,{ $set: { hasRead: true } },{multi:false});      
  }
    
});