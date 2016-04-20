/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* Dob: Event Handlers */
/*****************************************************************************/
Template.Dob.events({
  'click .Confirm': function (argument) {
    var user = Meteor.user();
    lodash.set(user, 'dob', $("#dobInput").val());
    Meteor.call("profileUpdateByObj", user, function (error, result) {
      if (error) {
        log.error("error", error);
      } else {
        Router.go('TabClasses');
      }
    });
  }
});