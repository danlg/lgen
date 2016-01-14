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
  'chatroomMenberName': function () {
    var names = [];
    var userObjArr = Meteor.users.find({_id: {$in: this.chatIds}}).fetch();
    lodash.forEach(userObjArr, function (el, index) {
      if (el._id !== Meteor.userId()) {
        var name = getFullNameByProfileObj(el.profile);
        names.push(name);
      }
    });
    return lodash(names).toString();
  },

  'lasttext': function (messagesObj) {
    var len = messagesObj.length;
    if (len > 0)
      return messagesObj[len - 1].text;
    else
      return "";

  },
  'isHide': function (chatIds) {
    var chatIdsLocal = chatIds;
    if (text.get() !== "") {
      var names = [];
      var userObjArr = Meteor.users.find({_id: {$in: this.chatIds}}).fetch();
      lodash.forEach(userObjArr, function (el, index) {
        if (el._id !== Meteor.userId()) {
          var name = getFullNameByProfileObj(el.profile);
          names.push(name);
        }
      });
      if (lodash.includes(lodash(names).toString().toUpperCase(), text.get().toUpperCase())) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  },

  'chatRoomUserAvatar': function () {
    var avatars = [];
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
