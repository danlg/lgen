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
  'isMind':function(from){
    $(".content").animate({ scrollTop: $('.content')[0].scrollHeight}, 100);
    return from._id===Meteor.userId();
  },
  sendTime:function(sendAt){
    return moment(sendAt,"HH:mm")
  }
});

/*****************************************************************************/
/* ChatRoom: Lifecycle Hooks */
/*****************************************************************************/
Template.ChatRoom.created = function () {
};

Template.ChatRoom.rendered = function () {
  $(".content").animate({ scrollTop: $('.content')[0].scrollHeight}, 100);
  if(Meteor.isCordova){
    window.addEventListener('native.keyboardshow', keyboardShowHandler);
  }
};

Template.ChatRoom.destroyed = function () {
};

function keyboardShowHandler(e){
  $(".content").animate({ scrollTop: $('.content')[0].scrollHeight}, 100);
    /*alert('Keyboard height is: ' + e.keyboardHeight);*/
}
