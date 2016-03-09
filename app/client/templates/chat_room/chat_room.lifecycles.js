/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* ChatRoom: Lifecycle Hooks */
/*****************************************************************************/
var currentChatroomId;
Template.ChatRoom.created = function () {
};

Template.ChatRoom.rendered = function () {
   currentChatroomId = Router.current().params.chatRoomId;
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
 



  $(".inputBox").autogrow();
  var chatroomList = this.find('.chatroomList');
  
  var initialChatObj = Chat.findOne({_id: Router.current().params.chatRoomId});
  var initialCount = initialChatObj.messagesObj.length;
  
  //http://stackoverflow.com/questions/32461639/how-to-execute-a-callback-after-an-each-is-done
  this.autorun(function(){
    var latestChatObj = Chat.findOne({_id: Router.current().params.chatRoomId});
   
    // we need to register a dependency on the number of documents returned by the
    // cursor to actually make this computation rerun everytime the count is altered
    var latestCount = latestChatObj.messagesObj.length;
    
    Tracker.afterFlush(function(){
        if(latestCount > initialCount){

        log.info('show new message bubble');
        $('.new-message-bubble').remove();

        var newMessageBubbleText = '<div class="date-bubble-wrapper new-message-bubble"> <div class="date-bubble"><i class="icon ion-android-arrow-dropdown"></i>new messages<i class="icon ion-android-arrow-dropdown"></i> </div> </div>';
        $('i.ion-email-unread').first().parents('div.item').before(newMessageBubbleText);
            
            initialCount = latestCount;
        }
    }.bind(this));
  }.bind(this));  
  /****track if there are any new messages - END *********/   

  var newMessageBubbleText = '<div class="date-bubble-wrapper new-message-bubble"> <div class="date-bubble"><i class="icon ion-android-arrow-dropdown"></i>new messages<i class="icon ion-android-arrow-dropdown"></i> </div> </div>';
 $('i.ion-email-unread').first().parents('div.item').before(newMessageBubbleText);
};

Template.ChatRoom.destroyed = function () {
    
    //log.info('destroy chat room!');
    //var chatRoomId = Router.current().params.chatRoomId;
    // hasRead => false to true (start)
                   
    Meteor.call('setAllChatMessagesAsRead',currentChatroomId);
             
     // hasRead => false to true (end)  
};