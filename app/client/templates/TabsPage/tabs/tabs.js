/*****************************************************************************/
/* Tabs: Event Handlers */
/*****************************************************************************/
Template.Tabs.events({});

/*****************************************************************************/
/* Tabs: Helpers */
/*****************************************************************************/
Template.Tabs.helpers({
  _Chat: function(argument) {
    return TAPi18n.__('Chat');
  },
  _Classes: function(argument) {
    return TAPi18n.__('Classes');
  },
  _You: function(argument) {
    return TAPi18n.__('You');
  }
});

/*****************************************************************************/
/* Tabs: Lifecycle Hooks */
/*****************************************************************************/
Template.Tabs.created = function() {};

Template.Tabs.rendered = function() {};

Template.Tabs.destroyed = function() {};
