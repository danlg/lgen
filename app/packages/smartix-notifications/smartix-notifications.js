Smartix = Smartix || {};

Smartix.Notifications = Smartix.Notifications || {};

Smartix.Notifications.Helpers = Smartix.Notifications.Helpers || {};

Smartix.Notifications.Helpers.sumOfNewChatMessageCounter = function(){
   var newMessageCount =  Notifications.find({'eventType':'newchatmessage','hasRead':false}).count();
      
   if(newMessageCount > 0 ){
       return newMessageCount;
   }else{
       return false;
   }    
}

Smartix.Notifications.Helpers.sumOfNewClassMessageAndCommentCounter = function(){
   var newMessageCount =  Notifications.find({'eventType':'newclassmessage','hasRead':false}).count();
   var newCommentCount =  Notifications.find({'eventType':'newclasscomment','hasRead':false}).count();
        
   if(newMessageCount+newCommentCount > 0 ){
       return (newMessageCount+newCommentCount);
   }else{
       return false;
   }
}

Smartix.Notifications.Helpers.sumOfAllNotificationCounter = function(){
   var newChatMessageCount =  Notifications.find({'eventType':'newchatmessage','hasRead':false}).count();    
   var newClassMessageCount =  Notifications.find({'eventType':'newclassmessage','hasRead':false}).count();
   var newClassCommentCount =  Notifications.find({'eventType':'newclasscomment','hasRead':false}).count();
        
   if( (newChatMessageCount + newClassMessageCount+newClassCommentCount) > 0 ){
       return (newChatMessageCount + newClassMessageCount + newClassCommentCount);
   }else{
       return false;
   }  
}