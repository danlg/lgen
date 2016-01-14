/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* ChatRoom: Helpers */
/*****************************************************************************/
Template.ChatRoom.helpers({
  chatRoomProfile: function () {
    return Chat.findOne({_id: Router.current().params.chatRoomId});
  },
  withExtraRightPadding:function(){
    if(!Meteor.isCordova){
      return "padding-right:40px;"
    }else{
      return "";
    }
  },  
  isMine: function () {
    return this.from === Meteor.userId() ? "mine" : "notmine";
  },

  userProfile: function () {
    //get another person's user object in 1 to 1 chatroom.     
    var userObj = getAnotherUser();
    return userObj
  },
  getGroupOrCorrespondentAvatar : function () {
    //get other person's avatar (todo add  group avatar lookup when implemented)
    var userObj = getAnotherUser();
    return userObj && userObj.profile && userObj.profile.useravatar;
  },
  
  getName: function (profile) {    
    var userObj = getAnotherUser();
    return userObj && getFullNameByProfileObj(userObj.profile);
  },

  isText: function () {
    return this.text !== "";
  },

  isImage: function () {
    return this.image && this.image !== "";
  },

  isSound: function (argument) {
    return this.sound && this.sound !== "";
  },
  
  isDocument: function(){
    return this.document && this.document !== "";  
  },
  
  getDocument: function(){
    var DocumentId = this.document;
    return Documents.findOne(DocumentId);    
  },
  
  getImage: function () {
    var ImageId = this.image.replace("/cfs/files/images/", "");
    return Images.findOne(ImageId);
  },

  isWorkOff: function (argument) {
    
    //get another person's user object in 1 to 1 chatroom.     
    var targetUserObj = getAnotherUser();

  },

  targertWorkingTime: function (argument) {
    var displayOffline = false;
    var target = getAnotherUser();
    if (target.profile.role === "Teacher") {
      if (target.profile.chatSetting && target.profile.chatSetting.workHour) {
        
        
        var workHourTime = target.profile.chatSetting.workHourTime;
        var dayOfWeek = moment().day();
        var fromMoment = moment(workHourTime.from, "HH:mm");
        var toMoment = moment(workHourTime.to, "HH:mm");
        var range = moment.range(fromMoment, toMoment);

        //if today is not in work day
        if(!workHourTime.weeks[dayOfWeek-1]){
            displayOffline = true;
        }           
        //if currently not in work hour
        if (!range.contains(moment())) {
            displayOffline = true;
        }
     
      }
    }
    return displayOffline;
  },

  getSound: function (argument) {
    // var SoundId = this.image.replace("/cfs/files/sounds/","");
    return Sounds.findOne(this.sound);
  },

  soundsCollection: function (argument) {
    return Sounds.find();
  }

});

////get another person's user object in 1 to 1 chatroom. call by chatroom helpers
function getAnotherUser(){
            //find all userids in this chat rooms
  var query = Chat.findOne({_id: Router.current().params.chatRoomId});
  if (query) {
    var arr = query.chatIds;
    //find and remove the userid of the current user
    var currentUserIdIndex = arr.indexOf(Meteor.userId());
    arr.splice(currentUserIdIndex, 1);

    //return another user's user object
    var targetUserObj = Meteor.users.findOne(arr[0]);
    return targetUserObj;
  }
}