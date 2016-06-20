/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Template.Feedback.events({});

/* Lifecycle Hooks */
Template.Feedback.onCreated( function() {
});

Template.Feedback.onRendered( function() {
});

Template.Feedback.destroyed = function () {
};

Template.ionNavBar.events({
  'click .feedbackSend': function (e, template) {
    IonLoading.show({
      backdrop: true
    });
    Meteor.call("feedback", $(".feedbackContent").val(), function (err, result) {
      IonLoading.hide();
      if (err)
        toastr.error(err.reason);
      else {
        toastr.success(TAPi18n.__("Thanks_for_sharing"));
      }
    });
  }
});
