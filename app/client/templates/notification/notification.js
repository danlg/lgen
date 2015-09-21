/*****************************************************************************/
/* Notification: Event Handlers */
/*****************************************************************************/
Template.Notification.events({});

/*****************************************************************************/
/* Notification: Helpers */
/*****************************************************************************/
Template.Notification.helpers({
  msgObj: function () {
    var classes = Classes.findOne();
    var msgObj = classes.messagesObj;
    return lodash.find(msgObj, 'msgId', Router.current().params.msgCode);
  }

});

/*****************************************************************************/
/* Notification: Lifecycle Hooks */
/*****************************************************************************/
Template.Notification.created = function () {
};

Template.Notification.rendered = function () {
};

Template.Notification.destroyed = function () {
};
