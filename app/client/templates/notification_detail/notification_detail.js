/*****************************************************************************/
/* NotificationDetail: Event Handlers */
/*****************************************************************************/
Template.NotificationDetail.events({});

/*****************************************************************************/
/* NotificationDetail: Helpers */
/*****************************************************************************/
Template.NotificationDetail.helpers({
  msgObj: function () {
    var classes = Classes.findOne({'messagesObj.msgId':Router.current().params.msgCode});
    var msgObj = classes.messagesObj;
    return lodash.find(msgObj, 'msgId', Router.current().params.msgCode);
  },
  classObj: function () {
    return Classes.findOne({'messagesObj.msgId':Router.current().params.msgCode});
  }
});

/*****************************************************************************/
/* NotificationDetail: Lifecycle Hooks */
/*****************************************************************************/
Template.NotificationDetail.created = function () {
};

Template.NotificationDetail.rendered = function () {
};

Template.NotificationDetail.destroyed = function () {
};
