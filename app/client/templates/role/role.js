/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* Role: Event Handlers */
/*****************************************************************************/
Template.Role.events({
  "click .button": function (e) {
    var $this = $(e.target);
    if (Meteor.user()) {
      Meteor.call('user/role/update', $this.data('role'), function () {
       routeToTabClasses();
      });
    } else {
      Router.go('EmailSignin', {role: $this.data('role')});
    }
  }
});

/*****************************************************************************/
/* Role: Helpers */
/*****************************************************************************/
Template.Role.helpers({
  "char": ["Teacher", "Student", "Parent"]
});

/*****************************************************************************/
/* Role: Lifecycle Hooks */
/*****************************************************************************/
Template.Role.created = function () {

};

Template.Role.rendered = function () {
  IonModal.open('_modal');
};

Template.Role.destroyed = function () {
};


Template._modal.events({
  'click .role': function (e) {
    IonModal.close('_modal');
    var role = $(e.target).data('role');

    if (Meteor.userId()) {
      Meteor.call('user/role/update', role, function () {
        //invite user to download the app if they are using web version
        //we are doing this in the tab classes
        routeToTabClasses();
      });
    }
    else {
      Router.go('EmailSignup', {role: role});
    }
  }

});