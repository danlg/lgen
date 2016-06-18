/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

var targetStringVar = ReactiveVar([]);
var targetString = [];
var targetIds = ReactiveVar([]);
var searchString = ReactiveVar("");

/* ChatInvite: Event Handlers */
Template.GroupChatInvite.events({
  'click .classItem':function(){
    log.info(this);
    Router.go('GroupChatInviteChooser',{classCode:this.classCode, school: UI._globalHelpers['getCurrentSchoolName']()});
  },

  'click .startChatBtn': function () {
  },

  'change .targetCB': function (e) {
    targetString = [];
    targetIds.set([]);
    var localarr = [];
    localarr.push($(e.target).val());
    targetString.push($(e.target).data("className"));
    targetStringVar.set(targetString);
    targetIds.set(localarr);
  },

  'keyup .searchbar': function () {
    searchString.set($(".searchbar").val().trim());
  }
});

Template.GroupChatInvite.helpers({
  'myclasses': function () {
    return Smartix.Groups.Collection.find({
        type: 'class',
        admins: Meteor.userId()
    });
  },

  isSearchable: function () {
    //log.info("className:"+this.className+":searchString:"+searchString.get());
    //log.info("isSearchable:"+lodash.includes(this.className.toUpperCase(), searchString.get().toUpperCase()));
    return lodash.includes(this.className.toUpperCase(), searchString.get().toUpperCase());
  },

  shouldhide: function () {
    log.info("shouldhide:"+targetIds.get());
    return targetIds.get().length > 0 ? "" : "hide";
  },

  getChatInvitePath:function(){
    return  Router.path('ChatInvite',{school: UI._globalHelpers['getCurrentSchoolName']()});
  }
});

Template.GroupChatInvite.destroyed = function () {
 targetStringVar = ReactiveVar([]);
 targetString = [];
 targetIds = ReactiveVar([]);
 searchString = ReactiveVar("");   
};
