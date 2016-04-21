GeneralMessageSender = function(groupId,messageType,messageText,addons,targetUsers,callback){
    
    //e.g each addons :
    //{type:messageType,fileId:messageAttachmentObject._id}
    /*var targetUsersIds = lodash.map(targetUsers, '_id');
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
    } else if (messageType == 'images') {
        pushObj.image = messageAttachmentObject._id
    } else if (messageType =='documents') {
        pushObj.document = messageAttachmentObject._id
    }*/

    addons = addons || [];
    /*if(messageType == 'voice' || messageType == 'images' || messageType == 'documents'){
        addons.push({type:messageType,fileId:messageAttachmentObject._id});
        messageType = "text";
    }*/

    console.log(messageType);
    
    if(messageType == 'text'){
        Meteor.call('smartix:messages/createMessage',groupId,messageType,{content:messageText},
                    addons
                );
    }

    
    //add message to chat collection
    /*Meteor.call("chat/sendImage", groupId, pushObj, function (error, result) {
        //log.info(groupId);
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
                groupId: groupId,
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
                        groupId: groupId
                    },
                    query:{userId:eachTargetUser._id},
                    badge: Smartix.helpers.getTotalUnreadNotificationCount(eachTargetUser._id)
                };
                Meteor.call("serverNotification", notificationObj,{
                    groupId: groupId
                });             
                
            });
        });
        //4. send analytics
        if(messageType == 'text'){
          if (Meteor.user().firstChat) {
          analytics.track("First Chat", {
              date: new Date(),
          });
          Meteor.call("updateProfileByPath", 'firstChat', false);
          }
        }else if(messageType == 'voice'){


        }else if(messageType == 'image'){
          if (Meteor.user().firstPicture) {
              analytics.track("First Picture", {
                  date: new Date(),
              });
              Meteor.call("updateProfileByPath", 'firstPicture', false);
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

    });*/

    //callback is for UI update e.g buttonToggle, autogrow inputbox refresh, clean up inputBox
    callback();
};
