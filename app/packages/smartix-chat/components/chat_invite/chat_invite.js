/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

var targetStringVar = ReactiveVar([]);
var targetString = [];
var targetIds = ReactiveVar([]);
var searchString = ReactiveVar("");
/*****************************************************************************/
/* ChatInvite: Event Handlers */
/*****************************************************************************/
Template.ChatInvite.events({
  'click .startChatBtn': function () {
    /*var chatArr =  $('.js-example-basic-multiple').val();*/
      console.log('targetIds', targetIds.get() );
      Meteor.call('chatCreate', targetIds.get(),null, Session.get('pickedSchoolId'), function (err, data) {
      
      Router.go('ChatRoom', {chatRoomId: data});
    });
    /*log.info($('.js-example-basic-multiple').val());*/
  },

  'change .targetCB': function (e) {
    targetString = [];
    targetIds.set([]);
    var localarr = [];
    // $(".targetCB:checked").each(function(index,el){
    // localarr.push($(el).val());
    // targetString.push($(el).data("fullname"));
    // });
    // $(e.target).attr('checked','checked');
    localarr.push($(e.target).val());
    targetString.push($(e.target).data("fullname"));
    targetStringVar.set(targetString);
    targetIds.set(localarr);
  },

  'keyup .searchbar': function () {
    searchString.set($(".searchbar").val().trim());
  }
});

/*****************************************************************************/
/* ChatInvite: Helpers */
/*****************************************************************************/
Template.ChatInvite.helpers({
  'classesJoinedOwner': function () {
    var classesJoinedOwner = Meteor.users.find({_id: {$nin: [Meteor.userId()]}}).fetch();
    if (classesJoinedOwner.length < 1) {
      return false;
    } else {
      return classesJoinedOwner;
    }
  },

  userName: function (profile) {
    return Smartix.helpers.getFullNameByProfileObj(profile);
  },

  targetCB: function () {
  },

  tagertList: function () {
    return targetStringVar.get();
  },

  shouldDisplay: function () {
    return targetIds.get().length > 0 ? true : false;
  },

  isSearchable: function () {
    return lodash.includes(Smartix.helpers.getFullNameByProfileObj(this.profile).toUpperCase(), searchString.get().toUpperCase());
  }
});

/*****************************************************************************/
/* ChatInvite: Lifecycle Hooks */
/*****************************************************************************/
Template.ChatInvite.created = function () {
};

Template.ChatInvite.rendered = function () {
  // $(".js-example-basic-multiple").select2({
  //   tags: true,
  //   tokenSeparators: [',', ' '],
  //   width:"100%"
  //   });
};

Template.ChatInvite.destroyed = function () {
 targetStringVar = ReactiveVar([]);
 targetString = [];
 targetIds = ReactiveVar([]);
 searchString = ReactiveVar("");   
};
