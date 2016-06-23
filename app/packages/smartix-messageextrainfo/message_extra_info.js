/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var classObj;
var isRecording = false;
var media = "";
var isPlayingSound = false;
/*****************************************************************************/
/* MessageExtraInfo: Event Handlers */
/*****************************************************************************/
Template.MessageExtraInfo.onCreated( function(){
      this.subscribe('smartix:messages/messagesById', Router.current().params.msgCode);
      this.subscribe('smartix:classes/classMembers', Router.current().params.classCode); 
});

/*****************************************************************************/
/* MessageExtraInfo: Helpers */
/*****************************************************************************/
Template.MessageExtraInfo.helpers({
  classObj: function () {
    classObj = Smartix.Groups.Collection.findOne({
        type: 'class',
        'messagesObj.msgId':this.msgCode
    });
    return classObj;
  },
  msgObj: function () {
    //var msgArr = Smartix.Groups.Collection.findOne({type:'class', 'messagesObj.msgId':this.msgCode}).messagesObj;
    //var filtedArr = lodash.findByValues(msgArr, "msgId", this.msgCode);
    return this.inputMessageObj;
  },
  getCommentObj:function(){
    return lodash.find(this.inputMessageObj.addons,{type:'comment'});
  },
  getPollObj:function(){
    return lodash.find(this.inputMessageObj.addons,{type:'poll'});
  },  
  className: function () {
    return classObj.className;
  },
  isNotEmpty: function (action) {
    return action.length > 0;
  },
  getNameById: function (userId) {
    var userObj = Meteor.users.findOne({ '_id': userId});
    if(userObj)
      return userObj._id == Meteor.userId() ? "You" : userObj.profile.firstName + " " + userObj.profile.lastName;
    else 
      return "";  
  },
  getName: function (userObj) {
    return userObj._id == Meteor.userId() ? "You" : userObj.profile.firstName + " " + userObj.profile.lastName;
  },
  star: function () {
    return this.inputMessageObj.star;
  },
  allMan: function () {
    var msgArr = this.inputMessageObj;
    var arr = [];
    var filtedArr = lodash.findByValues(msgArr, "msgId", this.msgCode);
    arr.push(filtedArr[0].star);
    arr.push(filtedArr[0].close);
    arr.push(filtedArr[0].help);
    arr.push(filtedArr[0].checked);
    return lodash.flatten(arr);
  },
  geticon: function (userObj) {
  },
  havePic: function () {
    return this.imageArr.length > 0;
  },
  getImage: function () {
    var id = this.toString();
    return Images.findOne(id);
  },
  haveSound: function () {
    return this.soundArr.length > 0;
  },
  getSound: function () {
    var id = this.toString();
    return Sounds.findOne(id);
  },
  isNewComment:function(createdAt){   
     var result = Notifications.findOne({"eventType":"newclasscomment",'messageCreateTimestamp':createdAt});       
     //backward comptability
     if(!result){
         return "";
     }  
     if(result.hasRead == false){
         return 'ion-record';
     }else{
         return "";
     }
  }
});


