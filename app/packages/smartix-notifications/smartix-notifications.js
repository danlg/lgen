Smartix = Smartix || {};

Smartix.Notifications = Smartix.Notifications || {};

Smartix.Notifications.Helpers = Smartix.Notifications.Helpers || {};

Smartix.Notifications.Helpers.sumOfNewChatMessageCounter = function(){
    
   var groupsInNamespace =  Smartix.Groups.Collection.find({namespace:Session.get('pickedSchoolId')},{fields: {_id:1}}).fetch();
   var groupIdsInNamespace = lodash.map(groupsInNamespace,"_id");
       
   var newMessageCount =  Notifications.find({'eventType':'newchatmessage','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();
      
   if(newMessageCount > 0 ){
       return newMessageCount;
   }else{
       return false;
   }    
}

Smartix.Notifications.Helpers.sumOfNewClassMessageAndCommentCounter = function(){
   
   var groupsInNamespace =  Smartix.Groups.Collection.find({namespace:Session.get('pickedSchoolId')},{fields: {_id:1}}).fetch();
   var groupIdsInNamespace = lodash.map(groupsInNamespace,"_id");
   
   
   var newMessageCount =  Notifications.find({'eventType':'newclassmessage','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();
   var newCommentCount =  Notifications.find({'eventType':'newclasscomment','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();
        
   if(newMessageCount+newCommentCount > 0 ){
       return (newMessageCount+newCommentCount);
   }else{
       return false;
   }
}

Smartix.Notifications.Helpers.sumOfNewNewsCounter = function(){
   
   var groupsInNamespace =  Smartix.Groups.Collection.find({namespace:Session.get('pickedSchoolId')},{fields: {_id:1}}).fetch();
   var groupIdsInNamespace = lodash.map(groupsInNamespace,"_id");
   
   
   var newMessageCount =  Notifications.find({'eventType':'newnewsgroupmessage','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();
        
   if(newMessageCount > 0 ){
       return newMessageCount;
   }else{
       return false;
   }  
}

Smartix.Notifications.Helpers.sumOfAllNotificationCounter = function(){
   var groupsInNamespace =  Smartix.Groups.Collection.find({namespace:Session.get('pickedSchoolId')},{fields: {_id:1}}).fetch();
   var groupIdsInNamespace = lodash.map(groupsInNamespace,"_id");
       
   var newChatMessageCount =  Notifications.find({'eventType':'newchatmessage','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();    
   var newClassMessageCount =  Notifications.find({'eventType':'newclassmessage','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();
   var newClassCommentCount =  Notifications.find({'eventType':'newclasscomment','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();
        
   if( (newChatMessageCount + newClassMessageCount+newClassCommentCount) > 0 ){
       return (newChatMessageCount + newClassMessageCount + newClassCommentCount);
   }else{
       return false;
   }  
}

Template.registerHelper('sumOfNewChatMessageCounter',Smartix.Notifications.Helpers.sumOfNewChatMessageCounter);
Template.registerHelper('sumOfNewNewsCounter',Smartix.Notifications.Helpers.sumOfNewNewsCounter);
Template.registerHelper('sumOfNewClassMessageAndCommentCounter',Smartix.Notifications.Helpers.sumOfNewClassMessageAndCommentCounter );
Template.registerHelper('sumOfAllNotificationCounter',Smartix.Notifications.Helpers.sumOfAllNotificationCounter);