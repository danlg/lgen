/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* ChatRoom: Lifecycle Hooks */
/*****************************************************************************/
var currentChatroomId;
Template.ChatRoom.created = function () {
    this.loadedItems = new ReactiveVar(10);
    this.loadExtraItems = 5;
    this.localChatMessagesCollection = new Meteor.Collection(null);

    var self = this;

    this.autorun(function () {
        self.subscribe('smartix:messages/groupMessages', Router.current().params.chatRoomId);
    });    
};

Template.ChatRoom.rendered = function () {

   currentChatroomId = Router.current().params.chatRoomId;


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
  
  var initialChatObj = Smartix.Groups.Collection.findOne({_id: Router.current().params.chatRoomId});
  var initialCount; 
  if(!initialChatObj.messagesObj){
      initialCount = 0;
  }else{
      initialCount = initialChatObj.messagesObj.length;
  }
  
  //http://stackoverflow.com/questions/32461639/how-to-execute-a-callback-after-an-each-is-done
  this.autorun(function(){
    var latestChatObj = Smartix.Groups.Collection.findOne({_id: Router.current().params.chatRoomId});
   
    // we need to register a dependency on the number of documents returned by the
    // cursor to actually make this computation rerun everytime the count is altered
    var latestCount;
    if(!latestChatObj.messagesObj){
        latestCount = 0;
    }else{
        latestCount = latestChatObj.messagesObj.length;
    }
    
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

         log.info('show new message bubble');
        $('.new-message-bubble').remove();

            var newMessageBubbleText = '<div class="new-message-bubble"> <div class=""><i class="icon ion-android-arrow-dropdown"></i>NEW MESSAGES<i class="icon ion-android-arrow-dropdown"></i> </div> </div>';
            
            window.setTimeout(function(

            ){ $('i.ion-record').first().parents('div.item').before(newMessageBubbleText);},500);

                   
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

  var newMessageBubbleText = '<div class="new-message-bubble"> <div class="">' +
    '<i class="icon ion-android-arrow-dropdown"></i> NEW MESSAGES ' +
    '<i class="icon ion-android-arrow-dropdown"></i> </div> </div>';
 $('i.ion-record').first().parents('div.item').before(newMessageBubbleText);
};

Template.ChatRoom.destroyed = function () {
    
    //log.info('destroy chat room!');
    //var chatRoomId = Router.current().params.chatRoomId;
    // hasRead => false to true (start)
    this.loadedItems.set(10);
    this.localChatMessagesCollection = null;            
    Meteor.call('setAllChatMessagesAsRead',currentChatroomId);
             
     // hasRead => false to true (end)  
};