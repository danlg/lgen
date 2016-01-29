/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var text = ReactiveVar('');
var totalResult;
var notFoundResult = ReactiveVar(0);

/*****************************************************************************/
/* TabChat: Event Handlers */
/*****************************************************************************/
Template.TabChat.events({
  'keyup .searchbar': function () {
    notFoundResult.set(0);
    text.set($('.searchbar').val());
  }
});

/*****************************************************************************/
/* TabChat: Helpers */
/*****************************************************************************/
Template.TabChat.helpers({
  IAMTeacher: function (argument) {
    return Meteor.user().profile.role === "Teacher";
  },
  'getAllMyChatRooms': function () {
    var allchat = Chat.find();
    totalResult = allchat.length;
    if (Chat.find().count() > 0) {
      return allchat;
    } else {
      return false;
    }
  },
  //this implementation smells
  //duplicate of getChatRoomName //todo refactor
  'chatroomMemberName': function ( maxDisplay) {
    var names = [];
    var generatedString= "";
    if(this.chatRoomName){
        names.push(this.chatRoomName);
        generatedString = names.toString();
    }
    else {
        var maxNumberOfDisplayName = maxDisplay;
        var userObjArr = Meteor.users.find({_id: {$in: this.chatIds}}).fetch();
        if(userObjArr.length > 2){
            lodash.forEach(userObjArr, function (el, index) {
                    if( index < maxNumberOfDisplayName){
                        var name = getFirstName_ByProfileObj(el.profile);
                        names.push(name);
                    }
            });
          if(userObjArr.length > maxNumberOfDisplayName){
            //var finalStr = TAPi18n.__("And_amp")+ (userObjArr.length - maxNumberOfDisplayName) + "...";
            var finalStr = TAPi18n.__("And_amp")+ "...";
            generatedString = names.toString() + finalStr;
          }
          else {
            generatedString = names.toString();
          }
        }
        else{
            lodash.forEach(userObjArr, function (el, index) {
            if (el._id !== Meteor.userId()) {
                var name = getFullNameByProfileObj(el.profile);
                names.push(name);
            }
            });            
        }  
    }
    return generatedString;
  },

  'lasttext': function (messagesObj) {
    var len = messagesObj.length;
    if (len > 0)
      return messagesObj[len - 1].text;
    else
      return "";

  },
  'isHide': function (chatIds) {
    //var chatIdsLocal = chatIds;
    if (text.get() !== "") {
      var names = [];
      //get all user names in a chatroom
      var userObjArr = Meteor.users.find({_id: {$in: this.chatIds}}).fetch();
      lodash.forEach(userObjArr, function (el, index) {
        if (el._id !== Meteor.userId()) {
          var name = getFullNameByProfileObj(el.profile);
          names.push(name);
        }
      });
      //get chatroom name
      if(this.chatRoomName){
          names.push(this.chatRoomName);
      }
      //find if search string is included in the names string
      return !!lodash.includes(lodash(names).toString().toUpperCase(), text.get().toUpperCase());
    } else {
      return true;
    }
  },

  'chatRoomUserAvatar': function () {
    var avatars = [];
    
    if(this.chatRoomAvatar){
        avatars.push("e1a-"+ this.chatRoomAvatar);
    }else{
        var userObjArr = Meteor.users.find({_id: {$in: this.chatIds}}).fetch();
        lodash.forEach(userObjArr, function (el, index) {
        if (el._id !== Meteor.userId()) {
            var avatar = el.profile.useravatar;
            if (avatar){
            avatars.push("e1a-" + avatar)
            }
            else{
            avatars.push("e1a-green_apple");
            }
        }
        });
    }
    return lodash(avatars).toString();
  }
});

/*****************************************************************************/
/* TabChat: Lifecycle Hooks */
/*****************************************************************************/
Template.TabChat.created = function () {
};

Template.TabChat.rendered = function () {
  text.set("");
  $("body").removeClass('modal-open');
  Session.set("chatUnreadNumber", 0);

};

Template.TabChat.destroyed = function () {
  text.set("");
};
