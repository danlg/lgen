/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

/*****************************************************************************/
/* ChatRoom: Event Handlers */
/*****************************************************************************/
Template.ChatRoomInformation.events({
    'click .deleteChatRoomBtn': function () {
        //log.info("deleteChatRoomBtn is clicked");
        //log.info(this);
        
        Meteor.call("chat/delete",this._id,function(){
            Router.go('TabChat');
        })
    }
});

/*****************************************************************************/
/* ChatRoomInformation: Helpers */
/*****************************************************************************/
Template.ChatRoomInformation.helpers({
  chatRoomProfile: function () {
    var chatObj = Chat.findOne({_id: Router.current().params.chatRoomId});
    //log.info(chatObj);
    return chatObj;
  },
  isChatRoomModerator: function(context){     
        //log.info(context);
        //log.info(chatRoomProfile)
        if(context.chatRoomModerator == Meteor.userId()){
            return true;
        }else{
            return false;
        }
  },
  getUserById: function(userId){
    var targetUserObj = Meteor.users.findOne(userId);
    return targetUserObj;      
  }
});