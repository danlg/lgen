/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* Dob: Event Handlers */
/*****************************************************************************/
Template.Dob.events({
    'click .confirm': function(argument) {
        var dob = new Date($("#dobInput").val());
        Meteor.call('smartix:accounts/updateDob', dob, function(error, result) {
            if (error) {
                log.error("error", error);
            } else {
                Router.go('TabClasses');
            }
        });
    }
});