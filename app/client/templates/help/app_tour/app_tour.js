/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

Template.Tour.created = function () {
  if (Meteor.user() && Meteor.user().profile.hasUserSeenTour) {
    routeToTabClasses();
  }//else we show the tour
};

Template.Tour.events({
  'click .redirect-button': function() {
     if (Meteor.user() && (!Meteor.user().profile.hasUserSeenTour)) {
       //set the flag to true so it would not show again
        Meteor.users.update(Meteor.userId(), { $set: { "profile.hasUserSeenTour": true } });
     }
  }
 
});


