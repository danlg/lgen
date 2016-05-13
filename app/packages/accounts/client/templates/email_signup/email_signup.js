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
    log.info(classToBeJoined);

    $("body").removeClass('modal-open');
    
  if (Meteor.userId()) {
     Smartix.helpers.routeToTabClasses();     
  }    
};

Template.EmailSignup.onDestroyed = function() {
};

Template.EmailSignup.events({
    'click .createBtn': function(event, template) {
        var userObj = {};
        userObj.profile = {};
        var email = $(".email").val();
        var password = $(".password").val();
        
        if(password.length < 4) {
           toastr.error("At least 4 characters Password");
        }
        userObj.password = password;
        
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
                    
                    Meteor.loginWithPassword(email,password,function(err){
                        if(err){
                            toastr.error('Sign up fail. The emails is already taken');
                        }else{
                            toastr.info('Welcome. An verification email has also sent to your account. Click it to enable more features!')
                            log.info("login:meteor:" + Meteor.userId());
                            Smartix.helpers.routeToTabClasses();                            
                        }
                    });
                }

            });
        }
    },
    'click .google-login-btn':function(event, template) {
        Smartix.Accounts.registerOrLoginWithGoogle();
    } 
});
