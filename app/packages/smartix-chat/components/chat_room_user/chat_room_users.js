/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

Template.ChatRoomUsers.helpers({
    chatRoomUser: function()
    {
        var chatObj = Smartix.Groups.Collection.findOne({
        type: 'chat',
        classCode: Router.current().params.chatRoomId
    });
    var userArray = chatObj.users;
    //select users from Meteor who is not current user and has joined this class
    return Meteor.users.find({_id: {$in: userArray} }, 
            {sort: { 'profile.lastName': 1, 'profile.firstName': 1}} ).fetch()
    },

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
        if(Meteor.users.findOne(userId).profile.avatarType)
            return ( Meteor.users.findOne(userId).profile.avatarType==="emoji") ? true: false;   
        else   
            return true;
    }
});