/*****************************************************************************/
/* TabChat: Event Handlers */
/*****************************************************************************/
Template.TabChat.events({
});

/*****************************************************************************/
/* TabChat: Helpers */
/*****************************************************************************/
Template.TabChat.helpers({
  'getAllMyChatRooms':function(){
    return Chat.find({chatIds:{$in:[Meteor.userId()]}});
  },
  'toUser':function(chatIds){
    var chatIds = lodash.pull(chatIds,Meteor.userId());
    var user = Meteor.users.findOne({_id:{$in:chatIds}})
    return user.profile.firstname+" "+user.profile.lastname;
  }
});

/*****************************************************************************/
/* TabChat: Lifecycle Hooks */
/*****************************************************************************/
Template.TabChat.created = function () {
};

Template.TabChat.rendered = function () {
};

Template.TabChat.destroyed = function () {
};
