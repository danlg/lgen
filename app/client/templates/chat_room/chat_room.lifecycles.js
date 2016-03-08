/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* ChatRoom: Lifecycle Hooks */
/*****************************************************************************/
Template.ChatRoom.created = function () {
};

Template.ChatRoom.rendered = function () {

var imgReadyChecking = function(){

    var allImages = document.getElementsByTagName("img");
    for (var i=0; i<allImages.length; i++){
                     
        allImages[i].addEventListener('load', function() {
            //console.log('My width is: ', this.naturalWidth);
            //console.log('My height is: ', this.naturalHeight);
            this.style.width  = this.naturalWidth+"px";             
            this.style.height = this.naturalHeight+"px";
            this.width        = this.naturalWidth;
            this.height       = this.naturalHeight;
            this.alt = "";
            this.title = "";            
            window.setTimeout(function(){
                var chatroomListToBottomScrollTopValue = chatroomList.scrollHeight - chatroomList.clientHeight; 
                chatroomList.scrollTop = chatroomListToBottomScrollTopValue;                   
            }, 200);                      
        });
        
        window.setTimeout(function(){
            var chatroomListToBottomScrollTopValue = chatroomList.scrollHeight - chatroomList.clientHeight; 
            chatroomList.scrollTop = chatroomListToBottomScrollTopValue;                   
        }, 200);          
    }       

    window.setTimeout(function(){
        var chatroomListToBottomScrollTopValue = chatroomList.scrollHeight - chatroomList.clientHeight; 
        chatroomList.scrollTop = chatroomListToBottomScrollTopValue;                   
    }, 200);  

    


                                    
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
            $(".image-bubble img").last().get(0).alt = "loading";
            $(".image-bubble img").last().get(0).title  = "loading";
            $(".image-bubble img").last().get(0).width  = "300";   
            $(".image-bubble img").last().get(0).height  = "300";      
                                            
            imgReadyChecking();

            
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