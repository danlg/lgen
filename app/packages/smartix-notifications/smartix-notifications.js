Smartix = Smartix || {};

Smartix.Notifications = Smartix.Notifications || {};

Smartix.Notifications.Helpers = Smartix.Notifications.Helpers || {};

Smartix.Notifications.Helpers.sumOfNewChatMessageCounter = function(){
   let schoolId = UI._globalHelpers['getCurrentSchoolId']();
   //log.info("sumOfNewChatMessageCounter.schoolId", schoolId);
   //log.info("sumOfNewChatMessageCounter.pickedSchoolId", Session.get('pickedSchoolId'));
   let groupsInNamespace =  Smartix.Groups.Collection.find(
       //{ namespace:Session.get('pickedSchoolId') },
       { namespace: schoolId },
       { fields: {_id:1} }
   ).fetch();
   let groupIdsInNamespace = lodash.map(groupsInNamespace,"_id");
   let newMessageCount =  Notifications.find({'eventType':'newchatmessage','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();
   log.info("sumOfNewChatMessageCounter.newMessageCount", newMessageCount);
   if(newMessageCount > 0 ){
       return newMessageCount;
   }else{
       return false;
   }    
};

Smartix.Notifications.Helpers.sumOfNewClassMessageAndCommentCounter = function(){
   let groupsInNamespace =  Smartix.Groups.Collection.find(
       { namespace:Session.get('pickedSchoolId')},
       { fields: {_id:1}}
   ).fetch();
   let groupIdsInNamespace = lodash.map(groupsInNamespace,"_id");
   let newMessageCount =  Notifications.find({'eventType':'newclassmessage','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();
   let newCommentCount =  Notifications.find({'eventType':'newclasscomment','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();
   if(newMessageCount+newCommentCount > 0 ){
       return (newMessageCount+newCommentCount);
   }else{
       return false;
   }
};

Smartix.Notifications.Helpers.sumOfNewNewsCounter = function(){
   let groupsInNamespace =  Smartix.Groups.Collection.find({namespace:Session.get('pickedSchoolId')},{fields: {_id:1}}).fetch();
   let groupIdsInNamespace = lodash.map(groupsInNamespace,"_id");
   let newMessageCount =  Notifications.find({'eventType':'newnewsgroupmessage','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();
   if(newMessageCount > 0 ){
       return newMessageCount;
   }else{
       return false;
   }  
};

Smartix.Notifications.Helpers.sumOfNewCalendarCounter = function(){
   let newMessageCount =  Notifications.find({'hasRead':false,'namespace':Session.get('pickedSchoolId'), addons: 'calendar'}).count();
   if(newMessageCount > 0 ){
       return newMessageCount;
   }else{
       return false;
   }
};

Smartix.Notifications.Helpers.sumOfNewAttendanceCounter = function(){
   let newMessageCount =  Notifications.find({'eventType':'attendance','hasRead':false,'namespace':Session.get('pickedSchoolId')}).count();
   if(newMessageCount > 0 ){
       return newMessageCount;
   }else{
       return false;
   }
};

Smartix.Notifications.Helpers.sumOfNewAttendanceApprovedCounter = function(){
   let newMessageCount =  Notifications.find({'eventType':'attendance','eventSubType':'attendanceApproved','hasRead':false,'namespace':Session.get('pickedSchoolId')}).count();
   if(newMessageCount > 0 ){
       return newMessageCount;
   }else{
       return false;
   }
};

Smartix.Notifications.Helpers.sumOfAllNotificationCounter = function(){
   let groupsInNamespace =  Smartix.Groups.Collection.find({namespace:Session.get('pickedSchoolId')},{fields: {_id:1}}).fetch();
   let groupIdsInNamespace = lodash.map(groupsInNamespace,"_id");
   let newChatMessageCount =   Notifications.find({'eventType':'newchatmessage','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();
   let newClassMessageCount =  Notifications.find({'eventType':'newclassmessage','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();
   let newClassCommentCount =  Notifications.find({'eventType':'newclasscomment','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();
   let newAttendanceCount   =  Notifications.find({'eventType':'attendance','hasRead':false,'groupId':{ $in: groupIdsInNamespace }}).count();
      
   if( (newChatMessageCount + newClassMessageCount+newClassCommentCount + newAttendanceCount) > 0 ){
       return (newChatMessageCount + newClassMessageCount + newClassCommentCount + newAttendanceCount);
   }else{
       return false;
   }  
};

Template.registerHelper('sumOfNewCalendarCounter',Smartix.Notifications.Helpers.sumOfNewCalendarCounter);
Template.registerHelper('sumOfNewChatMessageCounter',Smartix.Notifications.Helpers.sumOfNewChatMessageCounter);
Template.registerHelper('sumOfNewNewsCounter',Smartix.Notifications.Helpers.sumOfNewNewsCounter);
Template.registerHelper('sumOfNewClassMessageAndCommentCounter',Smartix.Notifications.Helpers.sumOfNewClassMessageAndCommentCounter );
Template.registerHelper('sumOfNewAttendanceCounter',Smartix.Notifications.Helpers.sumOfNewAttendanceCounter);
Template.registerHelper('sumOfNewAttendanceApprovedCounter',Smartix.Notifications.Helpers.sumOfNewAttendanceApprovedCounter);
Template.registerHelper('sumOfAllNotificationCounter',Smartix.Notifications.Helpers.sumOfAllNotificationCounter);