/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* ChatRoom: Lifecycle Hooks */
/*****************************************************************************/
Template.ChatRoom.created = function () {
};

Template.ChatRoom.rendered = function () {

var imgReadyChecking = function(){
    var hasAllImagesLoaded =true;
    $('img').each(function(){
        if(this.complete){
            //log.info('loaded');
        }else{
            //log.info('not loaded');
            hasAllImagesLoaded = false;
        }
    });
    
    if(hasAllImagesLoaded){
        //log.info('scroll to bottom');
        //need to wrap the code inside autorun and subscriptionready
        //see http://stackoverflow.com/questions/32291382/when-the-page-loads-scroll-down-not-so-simple-meteor-js
        //scroll to bottom
        window.setTimeout(function(){
            var chatroomListToBottomScrollTopValue = chatroomList.scrollHeight - chatroomList.clientHeight; 
            chatroomList.scrollTop = chatroomListToBottomScrollTopValue;                   
        }, 200);
        
    }else{
        //if not all images is fully loaded, scroll bottom would not work.
        //so we set a timer to do the imgReadyChecking again later
        setTimeout(imgReadyChecking, 1000);
    }                                  
};   
  //$(".list.chatroomList").height("100%");
  //$(".list.chatroomList").height(($(".list.chatroomList").height() - 123) + "px");
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
                
            //scroll to bottom
            //scroll to bottom
            var lastImageElement = $(".image-bubble img").last().get(0);
            
            
            if(lastImageElement){
            lastImageElement.alt = "loading";
            lastImageElement.title  = "loading";
            lastImageElement.width  = "300";   
            lastImageElement.height  = "300";
            lastImageElement.style.width  = "300px";   
            lastImageElement.style.height  = "300px";            
           
            $(".image-bubble img").last().on('load', function () {
                lastImageElement.width  =   lastImageElement.naturalWidth;
                lastImageElement.height  = lastImageElement.naturalHeight;
                lastImageElement.style.width  = lastImageElement.naturalWidth+"px";
                lastImageElement.style.height  = lastImageElement.naturalHeight+"px";                
                var chatroomListToBottomScrollTopValue = chatroomList.scrollHeight - chatroomList.clientHeight; 
                chatroomList.scrollTop = chatroomListToBottomScrollTopValue;                         
             });
           }
            var chatroomListToBottomScrollTopValue = chatroomList.scrollHeight - chatroomList.clientHeight; 
            chatroomList.scrollTop = chatroomListToBottomScrollTopValue;                                   
            //imgReadyChecking();

            
            initialCount = latestCount;
        }
    }.bind(this));
  }.bind(this));  
  /****track if there are any new messages - END *********/  
  
  
    var template = this;
    //scroll to bottom
    this.autorun(function () {
        if (template.subscriptionsReady()) {
        Tracker.afterFlush(function () {
            

                //run immediately for the first time
            	imgReadyChecking();
               
        });
        }
    }); 
      
  /*
  template = this;
  template.atBottom = true;
  var onscroll;
  onscroll = _.throttle(function () {
    //Determine if an element has been totally scrolled
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
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
 */

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