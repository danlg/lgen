/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var text = ReactiveVar('');
// var classObj = ReactiveVar({});
/*****************************************************************************/
/* ClassUsers: Event Handlers */
/*****************************************************************************/
Template.ClassUsers.events({
  'keyup .searchbar': function (el) {
    text.set($(".searchbar").val());
  }
});

/*****************************************************************************/
/* ClassUsers: Helpers */
/*****************************************************************************/
Template.ClassUsers.helpers({
  usersProfile: function () {
    var users = Meteor.users.find({_id: {$nin: [Meteor.userId()]}}).fetch();
    /*return lodash.findByValuesNested(users,'profile','firstname',text.get())*/
    return users;
  },

  isSearched: function (userObj) {
    var name = getFullNameByProfileObj(userObj.profile);
    if (text.get() === "") {
      return true;
    } else {
      return lodash.includes(name.toUpperCase(), text.get().toUpperCase());
    }
  },

  emptyList: function () {
    return Meteor.users.find({_id: {$nin: [Meteor.userId()]}}).count() == 0 ;
  },

  classObj: function (argument) {
    return Classes.findOne({classCode: Router.current().params.classCode});
  },

  isPlural: function (count) {
    return count > 1;
  }
});

/*****************************************************************************/
/* ClassUsers: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassUsers.created = function () {
  // classObj.set(Classes.findOne({classCode:Router.current().params.classCode}));
};

Template.ClassUsers.rendered = function () {
  text.set("");
};

Template.ClassUsers.destroyed = function () {
};
