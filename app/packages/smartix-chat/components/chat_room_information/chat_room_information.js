/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */


Template.ChatRoomInformation.onCreated(function(){
    this.subscribe('chatRoomWithUser', Router.current().params.chatRoomId)
})

/*****************************************************************************/
/* ChatRoom: Event Handlers */
/*****************************************************************************/
Template.ChatRoomInformation.events({
    'click .deleteChatRoomBtn': function() {
        //log.info("deleteChatRoomBtn is clicked");
        //log.info(this);
        Meteor.call("chat/delete", this._id, function() {
            Router.go('TabChat');
        })
    }
});

/*****************************************************************************/
/* ChatRoomInformation: Helpers */
/*****************************************************************************/
Template.ChatRoomInformation.helpers({
    chatRoomProfile: function() {
        var chat = Smartix.Groups.Collection.findOne({ _id: Router.current().params.chatRoomId });
        return chat;
    },
    
    isOneToOne: function()
    {
        var chat = Smartix.Groups.Collection.findOne({ _id: Router.current().params.chatRoomId });
        return (chat.users.length == 2) ? true : false;
    },
    
    isChatRoomModerator: function(context) {
        var chat = Smartix.Groups.Collection.findOne({ _id: Router.current().params.chatRoomId });
        if(chat)
        {
            return (chat.admins.indexOf( Meteor.userId() ) != -1) ;
        }
    },
    
    getUserById: function(userId) {
        var targetUserObj = Meteor.users.findOne(userId);
        return targetUserObj;
    },
    
    isEmoji:function(userId){
        if(Meteor.users.findOne(userId).profile.avatarType)
            return ( Meteor.users.findOne(userId).profile.avatarType==="emoji") ? true: false;   
        else 
            return true;  
    }
});