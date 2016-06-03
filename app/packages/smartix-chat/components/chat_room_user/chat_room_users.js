/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

Template.ChatRoomUsers.helpers({
    isChatRoomModerator: function(context){     
        //log.info(context);
        //log.info(chatRoomProfile)
        if(context.chatRoomProfile.chatRoomModerator == Meteor.userId()){
            return true;
        }else{
            return false;
        }
    },
    getUserById: function(userId){
        var targetUserObj = Meteor.users.findOne(userId);
        return targetUserObj;      
    }
    , isEmoji:function(userId){
        return ( Meteor.users.findOne(userId).profile.avatarType==="emoji") ? true: false;   
    }
});