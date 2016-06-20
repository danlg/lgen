/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/* Tabs: Event Handlers */
Template.Tabs.events({});

/* Tabs: Helpers */
Template.Tabs.helpers({
  _Chat: function (argument) {
    return TAPi18n.__('Chat');
  },
  _Classes: function (argument) {
    return TAPi18n.__('Classes');
  },
  _You: function (argument) {
    return TAPi18n.__('You');
  }
});

/* Tabs: Lifecycle Hooks */
Template.Tabs.onCreated( function() {
});

Template.Tabs.onRendered( function() {
});

Template.Tabs.destroyed = function () {
};
