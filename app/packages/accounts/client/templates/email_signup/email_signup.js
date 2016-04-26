/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* EmailSignup: Event Handlers */
/*****************************************************************************/
/*
Template.EmailSignup.events({
    'focus #dobInput': function(argument) {
        $(".dobplaceholder").hide();
    },
    'blur #dobInput': function(argument) {
        if ($("#dobInput").val() === "")
            $(".dobplaceholder").show();
    }
});*/

/*****************************************************************************/
/* EmailSignup: Helpers */
/*****************************************************************************/
Template.EmailSignup.helpers({
    emailSignup: function(argument) {
        Schema.emailSignup.i18n("schemas.emailSignup");
        return Schema.emailSignup;
    }

});

/*****************************************************************************/
/* EmailSignup: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailSignup.onCreated = function() {
    var classToBeJoined = Session.get("search");
    console.log(classToBeJoined);

    $("body").removeClass('modal-open');
};

Template.EmailSignup.onDestroyed = function() {
};

Template.EmailSignup.events({
    'click .createBtn': function(event, template) {
        var userObj = {};
        userObj.profile = {};
        var email = $(".email").val();
        userObj.profile.firstName = $(".fn").val();
        userObj.profile.lastName = $(".ln").val();
        userObj.dob = $("#dobInput").val() || "";

        if (!Smartix.helpers.validateEmail(email)) {
            toastr.error("Incorrect Email");
        } else {
            Meteor.call('smartix:accounts/createUser', email, userObj, 'global', ['user'], function(err, res) {
                if (err) {
                    toastr.error(err.reason);
                    log.error(err);
                } else {
                    //create User successfully
                    analytics.track("Sign Up", {
                        date: new Date(),
                        email: userObj.email,
                        verified: false
                    });
                    
                    //TEMP. either send global user enrollment email or login with the password they have just passed
                    Meteor.loginWithPassword(email,'password',function(){
                        log.info("login:meteor:" + Meteor.userId());
                        Smartix.helpers.routeToTabClasses();
                    });
                }

            });
        }
    },
    'click .google-login-btn':function(event, template) {
        Smartix.Accounts.registerOrLoginWithGoogle();
    } 
});
