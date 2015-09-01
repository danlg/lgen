var classObj;
var teacherName = ReactiveVar("");
/*****************************************************************************/
/* ClassDetail: Event Handlers */
/*****************************************************************************/
Template.ClassDetail.events({
  'click .tab-item':function(e){
    var msgId = $(e.target.parentNode).data("msgid");
    var action = $(e.target.parentNode).data("action");
    Meteor.call('updateMsgRating',action,msgId,classObj);
  },
});

/*****************************************************************************/
/* ClassDetail: Helpers */
/*****************************************************************************/
Template.ClassDetail.helpers({
  classObj:function(){
    classObj = Classes.findOne();
    return classObj;
  },
  classCode:function(){
    var classObj =  Classes.findOne();
    return classObj.classCode;
  },
  className:function(){
    return classObj.className;
  },
  getClassName:function(){
    return Classes.findOne().className;
  },
  actions:function(){
    return ["star", "checked", "close", "help"];
  },
  isNotEmpty:function(action){
    return action.length>0;
  },
  createBy:function(){
    return classCode.createBy;
  },
  isSelectAction:function(action){
    return lodash.includes(lodash.map(action,"_id"),Meteor.userId())?"colored":"";
  },
  getMessagesObj:function(){
    var classObj  = Classes.findOne();
    if(classObj.messagesObj.length>0){
      return classObj.messagesObj;
    }else{
      return false;
    }
  },
  teacherName:function(){


    return teacherName.get();

  },
});

/*****************************************************************************/
/* ClassDetail: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassDetail.created = function () {
};

Template.ClassDetail.rendered = function () {
  Meteor.call('getFullNameById',classObj.createBy,function(err,data){
      return teacherName.set(data);
  });
};

Template.ClassDetail.destroyed = function () {

};
