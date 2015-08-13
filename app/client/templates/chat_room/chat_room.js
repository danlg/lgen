/*****************************************************************************/
/* ChatRoom: Event Handlers */
/*****************************************************************************/
Template.ChatRoom.events({
  'click .sendBtn':function(){
    var text = $('.inputBox').val();
    Meteor.call('chat/SendMessage',Router.current().params.chatRoomId,text,function(err,data){
      if(!err)
        $('.inputBox').val("");
      });
  }
});

/*****************************************************************************/
/* ChatRoom: Helpers */
/*****************************************************************************/
Template.ChatRoom.helpers({
  'chatRoomProfile':function(){
    return Chat.findOne({_id:Router.current().params.chatRoomId});
  },
  'isMind':function(fromId){
    return fromId===Meteor.userId();
  }
});

/*****************************************************************************/
/* ChatRoom: Lifecycle Hooks */
/*****************************************************************************/
Template.ChatRoom.created = function () {
};

Template.ChatRoom.rendered = function () {
};

Template.ChatRoom.destroyed = function () {
};
