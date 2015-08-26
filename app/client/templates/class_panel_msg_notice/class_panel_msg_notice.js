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
  },
  star:function(){
    return Classes.findOne().messagesObj.star
  },
  allMan:function(){
    var msgArr = Classes.findOne().messagesObj;
    var arr =[] ;
    var filtedArr = lodash.findByValues(msgArr,"msgId",Router.current().params.msgCode);

    arr.push(filtedArr[0].star);
    arr.push(filtedArr[0].close);
    arr.push(filtedArr[0].help);
    arr.push(filtedArr[0].checked);

    return lodash.flatten(arr);
  },
  geticon:function(userObj){

    /*var msgArr = Classes.findOne().messagesObj;
    var arr =[] ;
    var filtedArr = lodash.findByValues(msgArr,"msgId",Router.current().params.msgCode);

    if(lodash.includes(lodash.map(filtedArr[0].star,"_id"),userObj._id))
        return "ion-ios-star";
    if(lodash.includes(lodash.map(filtedArr[0].close,"_id"),userObj._id))*/



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
