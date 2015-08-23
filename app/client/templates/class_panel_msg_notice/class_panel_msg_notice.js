var classObj;
/*****************************************************************************/
/* ClassPanelMsgNotice: Event Handlers */
/*****************************************************************************/
Template.ClassPanelMsgNotice.events({
});

/*****************************************************************************/
/* ClassPanelMsgNotice: Helpers */
/*****************************************************************************/
Template.ClassPanelMsgNotice.helpers({
  classObj:function(){
    classObj = Classes.findOne();
    return classObj;
  },
  msgObj:function(){
    var msgArr = Classes.findOne().messagesObj;
    var filtedArr = lodash.findByValues(msgArr,"msgId",Router.current().params.msgCode);
    return filtedArr[0];
  },
  className:function(){
    return classObj.className
  },
  isNotEmpty:function(action){
    return action.length>0;
  },
  getName:function(userObj){
    return userObj._id==Meteor.userId()?"You":userObj.profile.firstname+" "+userObj.profile.lastname;
  }
});

/*****************************************************************************/
/* ClassPanelMsgNotice: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassPanelMsgNotice.created = function () {
};

Template.ClassPanelMsgNotice.rendered = function () {
};

Template.ClassPanelMsgNotice.destroyed = function () {
};
