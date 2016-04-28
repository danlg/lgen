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
  'sumOfNewChatMessageCounter': Smartix.Notifications.Helpers.sumOfNewChatMessageCounter,
  'sumOfNewClassMessageAndCommentCounter': Smartix.Notifications.Helpers.sumOfNewClassMessageAndCommentCounter,
  'sumOfAllNotificationCounter': Smartix.Notifications.Helpers.sumOfAllNotificationCounter

});

/*****************************************************************************/
/* Tabs: Lifecycle Hooks */
/*****************************************************************************/
Template.Tabs.created = function () {
};

Template.Tabs.rendered = function () {
};

Template.Tabs.destroyed = function () {
};
