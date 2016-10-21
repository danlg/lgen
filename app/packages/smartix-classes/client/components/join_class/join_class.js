/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/* JoinClass: Event Handlers */
Template.JoinClass.events({
  'click .joinBtn': function () {
    var classCodeInput = $(".classCodeInput").val().trim();
    if (classCodeInput === "") {
      toastr.warning(TAPi18n.__("JoinAClassByInputClassCode"));
      return false;
    }
    if (AutoForm.validateForm("joinClassForm") == false) {
      return;
    }
    //the form validation will check the uniqueness of the class no need to add login in the client side
    //$(joinform).submit();
    //TODO analytics to be moved in the server side and counter instead of flag
    if (Meteor.user().firstClassJoined) {
      analytics.track("First Class Joined", { date: new Date()});
      Meteor.call("updateProfileByPath", 'firstClassJoined', false);
    }
  },

  'click .leaveBtn': function (e) {
    var classId = $(e.target).attr("data-classId");
    Meteor.call('class/leave', classId);
  }
});

/* JoinClass: Helpers */
Template.JoinClass.helpers({
  leaveClassSchema: Smartix.Class.AutoformSchema.leaveClass,
  joinClassSchema: Smartix.Class.AutoformSchema.joinClass,
  joinedClasses: function () {
    return Smartix.Groups.Collection.find({
        type: 'class',
        users: Meteor.userId()
    });
  },
  getSchoolName: () => {
    return UI._globalHelpers['getCurrentSchoolName']();
  }
});

Template.JoinClass.onCreated( function() {
  this.subscribe('joinedClass');

});

Template.JoinClass.onRendered( function() {
});

Template.JoinClass.destroyed = function () {
};

Template.ionNavBar.events({
  'click .doneClassBtn': function (e, template) {
    Router.go('TabClasses');
  }
});
