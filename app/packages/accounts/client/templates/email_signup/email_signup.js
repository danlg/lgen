/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* EmailSignup: Event Handlers */
/*****************************************************************************/
Template.EmailSignup.events({
  'focus #dobInput': function (argument) {
    $(".dobplaceholder").hide();
  },
  'blur #dobInput': function (argument) {
    if ($("#dobInput").val() === "")
      $(".dobplaceholder").show();
  } 
});

/*****************************************************************************/
/* EmailSignup: Helpers */
/*****************************************************************************/
Template.EmailSignup.helpers({
  emailSignup: function (argument) {
    Schema.emailSignup.i18n("schemas.emailSignup");
    return Schema.emailSignup;
  }

});

/*****************************************************************************/
/* EmailSignup: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailSignup.onCreated = function () {
  var classToBeJoined = Session.get("search");
  console.log(classToBeJoined);

  $("body").removeClass('modal-open');
};

Template.EmailSignup.onDestroyed = function () {
};

Template.EmailSignup.events({
  'click .createBtn': function (event, template) {
    var userObj = {};
    userObj.profile = {};
    var email = $(".email").val();
    userObj.profile.firstName = $(".fn").val();
    userObj.profile.lastName = $(".ln").val();
    userObj.dob = $("#dobInput").val() || "";

    //if () {
    if (!Smartix.helpers.validateEmail(email)) {
      toastr.error("Incorrect Email");
    } else if ($(".pwd").val().length < 4) {
      toastr.error("At least 4 characters Password");
    } else {
        Smartix.Accounts.createUser(email, {
        password: $('.pwd').val(),
        profile: userObj.profile
      }, 'global', 'user', null, function (err, result) {
        if (err) {
          toastr.error(err.reason);
          log.error(err);
        } else {
            analytics.track("Sign Up", {
                date: new Date(),
                email: userObj.email,
                verified: false
            });
              
          // Since now we call account.createUser on server-side, we need to do login here.
          Meteor.loginWithPassword(userObj.email, $('.pwd').val(), function(){
            Session.set('registerFlow',true);
            Router.go('MyAccount');              
          });

        }
      });
    }
  },
  'click .google-login-btn':function(event,template){
    Smartix.Accounts.registerOrLoginWithGoogle();
  } 
});
