ChatRoomMessageSender = function(chatRoomId,messageType,messageText,messageAttachmentObject,targetUsers,callback){

    var targetUsersIds = lodash.map(targetUsers, '_id');
    var pushObj = {
        from:  Meteor.userId(),
        sendAt: moment().format('x'),
        createdAt:new Date(),
        text:""

    };
    if (messageType == 'text') {
        pushObj.text = messageText;
    } else if (messageType == 'voice') {
        pushObj.sound = messageAttachmentObject._id
    } else if (messageType == 'image') {
        pushObj.image = messageAttachmentObject._id
    } else if (messageType =='document') {
        pushObj.document = messageAttachmentObject._id
    }

    //add message to chat collection
    Meteor.call("chat/sendImage", chatRoomId, pushObj, function (error, result) {
        //log.info(chatRoomId);
        if (error) {
                log.error("error", error);
        }

        //four types of notification would be sent
        
        //1. send group chat email
        Meteor.call("chatroomEmail",targetUsers,Meteor.user(),messageText);

        //2. add notification to notifications collection
        //add notifications to db
        targetUsers.map(function(eachTargetUser){
            Notifications.insert({
                eventType:"newchatroommessage",
                userId: eachTargetUser._id,
                hasRead: false,
                chatroomId: chatRoomId,
                messageCreateTimestamp: result.createdAt,
                messageCreateTimestampUnixTime: result.sendAt,
                messageCreateByUserId: Meteor.userId()
            },function(){
                
                //3. send push notification and in-app notification
                var notificationObj = {
                    from : Smartix.helpers.getFullNameByProfileObj(Meteor.user().profile),
                    title : Smartix.helpers.getFullNameByProfileObj(Meteor.user().profile),
                    text: messageText,
                    payload:{
                        sound: 'Hello World',
                        type: 'chat',
                        chatRoomId: chatRoomId
                    },
                    query:{userId:eachTargetUser._id},
                    badge: Smartix.helpers.getTotalUnreadNotificationCount(eachTargetUser._id)
                };
                Meteor.call("serverNotification", notificationObj,{
                    chatRoomId: chatRoomId
                });             
                
            });
        });
        //4. send analytics
        if(messageType == 'text'){
          if (Meteor.user().profile.firstchat) {
          analytics.track("First Chat", {
              date: new Date(),
          });
          Meteor.call("updateProfileByPath", 'profile.firstchat', false);
          }
        }else if(messageType == 'voice'){


        }else if(messageType == 'image'){
          if (Meteor.user().profile.firstpicture) {
              analytics.track("First Picture", {
                  date: new Date(),
              });
              Meteor.call("updateProfileByPath", 'profile.firstpicture', false);
          }
        }else if (messageType =='document'){
          if (Meteor.user().profile.firstdocument) {
              analytics.track("First Document", {
                  date: new Date(),
              });
              Meteor.call("updateProfileByPath", 'profile.firstdocument', false);
          }
        }else
        {

        }

    });

    //callback is for UI update e.g buttonToggle, autogrow inputbox refresh, clean up inputBox
    callback();
};
