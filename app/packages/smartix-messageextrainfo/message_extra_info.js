/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var classObj;
var isRecording = false;
var media = "";
var isPlayingSound = false;
/*****************************************************************************/
/* MessageExtraInfo: Event Handlers */
/*****************************************************************************/
Template.MessageExtraInfo.events({

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
    var userObj = Meteor.users.findOne(userId);
    return userObj._id == Meteor.userId() ? "You" : userObj.profile.firstName + " " + userObj.profile.lastName;
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
  tryShowVoteOptionIcon : function(voteType,voteOption){
      var voteCountObj = {voteOptionText : voteOption};
      if(voteType == "checkedStarCloseHelp"){     
          if(voteOption =="star"){
            voteCountObj.ionicIcon = "ion-ios-star";
          }else if(voteOption =="checked"){
            voteCountObj.ionicIcon = "ion-checkmark-round";
          }else if(voteOption =="close"){
            voteCountObj.ionicIcon = "ion-close-round";  
          }else if(voteOption =="help"){
            voteCountObj.ionicIcon = "ion-help";
          }
      }else if(voteType == "checkedClose"){
          if(voteOption == "checked"){
            voteCountObj.ionicIcon = "ion-checkmark-round";
          }else if(voteOption == "close"){
            voteCountObj.ionicIcon = "ion-close-round";    
          }
      }else if(voteType == "heartNoEvilStarQuestion"){     
          if(voteOption =="heart"){
            voteCountObj.ionicIcon = "e1a-hearts";
          }else if(voteOption =="noevil"){
            voteCountObj.ionicIcon = "e1a-see_no_evil";
          //}else if(voteOption =="star"){
          //  voteCountObj.ionicIcon = "e1a-star";
          }else if(voteOption =="question"){
            voteCountObj.ionicIcon = "ion-help";
          }
      }else if(voteType == "yesNo"){
          if(voteOption == "yes"){
            voteCountObj.ionicIcon = "e1a-white_check_mark";
          }else if(voteOption == "no"){
            voteCountObj.ionicIcon = "e1a-negative_squared_cross_mark";    
          }
      }else if(voteType == "likeDislike"){
          if(voteOption == "like"){
            voteCountObj.ionicIcon = "e1a-hearts";
          }else if(voteOption == "dislike"){
            voteCountObj.ionicIcon = "e1a-see_no_evil";    
          }
      }else if(voteType == "oneTwoThreeFour"){
          if(voteOption == "one"){
            voteCountObj.ionicIcon = "e1a-one";
          }else if(voteOption == "two"){
            voteCountObj.ionicIcon = "e1a-two";    
          }else if(voteOption == "three"){
            voteCountObj.ionicIcon = "e1a-three";    
          }else if(voteOption == "four"){
            voteCountObj.ionicIcon = "e1a-four";    
          }
      }
      
      return voteCountObj;
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


