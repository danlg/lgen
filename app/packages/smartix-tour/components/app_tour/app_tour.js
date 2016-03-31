/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Template.Tour.events({
  'click .redirect-button': function() {
     if (Meteor.user() && (!Meteor.user().profile.hasUserSeenTour)) {
       //set the flag to true so it would not show again
        Meteor.users.update(Meteor.userId(), { $set: { "profile.hasUserSeenTour": true } });
        
     }
     
     //even if user is not registered, still can route to login pages.
     Smartix.helpers.routeToTabClasses();
  }
 
});


