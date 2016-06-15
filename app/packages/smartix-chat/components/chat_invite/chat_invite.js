/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

var targetStringVar = ReactiveVar([]);
var targetString = [];
var targetIds = ReactiveVar([]);
var searchString = ReactiveVar("");

/* ChatInvite: Lifecycle Hooks */
Template.ChatInvite.onCreated(function () {
   //NB: in master_layout. there is a allUsersWhoHaveJoinedYourClasses sub
   this.autorun(() => {
      this.subscribe('allSchoolUsersPerRole', Router.current().params.school );
   });
});


/* ChatInvite: Event Handlers */
Template.ChatInvite.events({
  'click .startChatBtn': function () {
      log.info('targetIds', targetIds.get() );
      Meteor.call('chatCreate', targetIds.get(),null, Router.current().params.school, function (err, data) {
      Router.go('ChatRoom', {chatRoomId: data});
    });
    /*log.info($('.js-example-basic-multiple').val());*/
  },

  'change .targetCB': function (e) {
    targetString = [];
    targetIds.set([]);
    var localarr = [];
    localarr.push($(e.target).val());
    targetString.push($(e.target).data("fullname"));
    targetStringVar.set(targetString);
    targetIds.set(localarr);
  },

  'keyup .searchbar': function () {
    searchString.set($(".searchbar").val().trim());
  }
});

/* ChatInvite: Helpers */
Template.ChatInvite.helpers({
  // 'classesJoinedOwner': function () {
  //   if (!Template.instance().subscriptionsReady()) return [];
  //   //var classesJoinedOwner = Meteor.users.find({_id: {$nin: [Meteor.userId()]}}).fetch();
  //   return Template.instance().allSchoolUsersPerRole();
  //   // var classesJoinedOwner = Meteor.users.find(
  //   //     {_id: {$nin: [Meteor.userId()]}},
  //   //     {sort: {lastName: -1}});
  //   // if (classesJoinedOwner.length < 1) {
  //   //   return false;
  //   // } else {
  //   //   return classesJoinedOwner;
  //   // }
  // },

   'classesJoinedOwner': function () {
     var classesJoinedOwner = Meteor.users.find({_id: {$nin: [Meteor.userId()]}}, {sort: { 'profile.lastName': 1, 'profile.firstName': 1}}).fetch();
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

  shouldDisplay: function () {
    return targetIds.get().length > 0 ;
  },

  isSearchable: function () {
    return lodash.includes(Smartix.helpers.getFullNameByProfileObj(this.profile).toUpperCase(), searchString.get().toUpperCase());
  },

  getGroupChatInvitePath:function(){
    return  Router.path('GroupChatInvite',{school: Router.current().params.school});
  },

  getUserRoleInNamespace:function(){
    if(Router.current().params.school !== 'global' && Router.current().params.school !== 'system'){
      var currentSchool = SmartixSchoolsCol.findOne({username:Router.current().params.school});
      var role = this.roles[currentSchool._id];
      return role ? role.toString() : "";
    }
  }
});


//http://www.meteorpedia.com/read/Understanding_Meteor_Publish_and_Subscribe
//Template.ChatInvite.onCreated = function () {
//  var self = this;
//  //NB: in master_layout. there is a allUsersWhoHaveJoinedYourClasses sub
//  self.autorun(function() {
//    self.subscribe('allSchoolUsersPerRole', Router.current().params.school );
//  });
//};

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
