/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* ChatRoom: Lifecycle Hooks */
/*****************************************************************************/
Template.ChatRoom.created = function () {
};

Template.ChatRoom.rendered = function () {
  //$(".list.chatroomList").height("100%");
  //$(".list.chatroomList").height(($(".list.chatroomList").height() - 123) + "px");
  $(".inputBox").autogrow();
  var chatroomList = this.find('.chatroomList');
  template = this;
  template.atBottom = true;
  var onscroll;
  onscroll = _.throttle(function () {
    return template.atBottom = chatroomList.scrollTop >= chatroomList.scrollHeight - chatroomList.clientHeight;
  }, 200);
  Meteor.setInterval(function () {
    if (template.atBottom) {
      chatroomList.scrollTop = chatroomList.scrollHeight - chatroomList.clientHeight;
    }
  }, 100);

  chatroomList.addEventListener('touchstart', function () {
    return template.atBottom = false;
  });

  chatroomList.addEventListener('touchend', function () {
    return onscroll();
  });

  chatroomList.addEventListener('scroll', function () {
    template.atBottom = false;
    return onscroll();
  });

  chatroomList.addEventListener('mousewheel', function () {
    template.atBottom = false;
    return onscroll();
  });

  chatroomList.addEventListener('wheel', function () {
    template.atBottom = false;
    return onscroll();
  });


  // if(needReduce){
  //   var height = $(".list.chatroomList").height();
  //   height= height - 60;
  //   log.info(height);
  //   $(".list.chatroomList").height(height+"px");
  //   needReduce = false;
  // }else{
  //   var height = $(".list.chatroomList").height();
  //   height= height + 60;
  //   log.info(height);
  //   $(".list.chatroomList").height(height+"px");
  // }
};

Template.ChatRoom.destroyed = function () {
};