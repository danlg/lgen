/*****************************************************************************/
/* ChatRoom: Event Handlers */
/*****************************************************************************/
Template.ChatRoom.events({
  'click .sendBtn':function(){
    var text = $('.inputBox').val();
    template.atBottom=true;
    Meteor.call('chat/SendMessage',Router.current().params.chatRoomId,text,function(err,data){
      if(!err)
        $('.inputBox').val("");
      });
  },
  'change .inputBox':function(){
    var height = $(".inputBoxList").height()+2;
    $(".chatroomList").css(height,"(100% - " + height +"px )");
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

    return from._id===Meteor.userId();
  },
  sendTime:function(sendAt){
    return moment(sendAt,"HH:mm")
  },
  userProfile:function(){
    var arr = Chat.findOne({_id:Router.current().params.chatRoomId}).chatIds;
    return lodash.reject(arr,{_id:Meteor.userId()})[0];
  },
  getName:function(profile){
    return getFullNameByProfileObj(profile)
  }

});

/*****************************************************************************/
/* ChatRoom: Lifecycle Hooks */
/*****************************************************************************/
Template.ChatRoom.created = function () {
};

Template.ChatRoom.rendered = function () {


  $(".inputBox").autogrow();

   chatroomList  = this.find('.chatroomList');

  template = this;

  template.atBottom=true;

  /*$(".content").animate({ scrollTop: $('.content')[0].scrollHeight}, 0);*/
  /*if(Meteor.isCordova){
    window.addEventListener('native.keyboardshow', keyboardShowHandler);
  }*/
  var onscroll;



onscroll = _.throttle(function() {
  return template.atBottom = chatroomList.scrollTop >= chatroomList.scrollHeight - chatroomList.clientHeight;
}, 200);


  Meteor.setInterval(function(){
    if(template.atBottom){
      chatroomList.scrollTop = chatroomList.scrollHeight - chatroomList.clientHeight
    }
  },100);


  chatroomList.addEventListener('touchstart', function() {
  return template.atBottom = false;
});

chatroomList.addEventListener('touchend', function() {
  return onscroll();
});

chatroomList.addEventListener('scroll', function() {
  template.atBottom = false;
  return onscroll();
});

chatroomList.addEventListener('mousewheel', function() {
  template.atBottom = false;
  return onscroll();
});

chatroomList.addEventListener('wheel', function() {
  template.atBottom = false;
  return onscroll();
});



};

Template.ChatRoom.destroyed = function () {
};

/*function keyboardShowHandler(e){
  $(".content").animate({ scrollTop: $('.content')[0].scrollHeight}, 100);
    alert('Keyboard height is: ' + e.keyboardHeight);
}*/
