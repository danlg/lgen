/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* Tabs: Event Handlers */
/*****************************************************************************/
Template.Tabs.events({});

/*****************************************************************************/
/* Tabs: Helpers */
/*****************************************************************************/
Template.Tabs.helpers({
  _Chat: function (argument) {
    return TAPi18n.__('Chat');
  },
  _Classes: function (argument) {
    return TAPi18n.__('Classes');
  },
  _You: function (argument) {
    return TAPi18n.__('You');
  },
  _chatNumber: function (argument) {
    if (Session.get("chatUnreadNumber") === 0) {
      return false;
    } else {
      return Session.get("chatUnreadNumber");
    }
  },
  'sumOfNewChatMessageCounter': function(){
   var newMessageCount =  Notifications.find({'eventType':'newchatroommessage','hasRead':false}).count();
      
   if(newMessageCount > 0 ){
       return newMessageCount;
   }else{
       return false;
   }
  },
  'sumOfNewClassMessageCounter': function(){
   var newMessageCount =  Notifications.find({'eventType':'newclassmessage','hasRead':false}).count();
      
   if(newMessageCount > 0 ){
       return newMessageCount;
   }else{
       return false;
   }
  }
});

/*****************************************************************************/
/* Tabs: Lifecycle Hooks */
/*****************************************************************************/
Template.Tabs.created = function () {
  Session.setDefault("chatUnreadNumber", 0);
};

Template.Tabs.rendered = function () {
};

Template.Tabs.destroyed = function () {
};
