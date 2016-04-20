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
  },
  isStudent: function () {
    return Template.instance().chosenRole.get() === "Student";
  }

});

/*****************************************************************************/
/* EmailSignup: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailSignup.created = function () {
  var classToBeJoined = Session.get("search");
  console.log(classToBeJoined);
  console.log("chosen role: " + Router.current().params.role);

  $("body").removeClass('modal-open');
  this.chosenRole = new ReactiveVar('');
  console.log("chosen role: ",this.chosenRole.get());
};

Template.EmailSignup.rendered = function () {


};

Template.EmailSignup.destroyed = function () {
};

Template.EmailSignup.events({
  'click .role-selection':function(event,template){
      //$(event.target).data('role');
      $(".role-selection").removeClass('chosen-role');
      $(event.currentTarget).addClass('chosen-role');          
      template.chosenRole.set($(event.currentTarget).data('role'));
  },
  'change #roleOptions':function(event,template){
      template.chosenRole.set($("#roleOptions").val());
      console.log("chosen role: ",template.chosenRole.get());
  },
  'click .createBtn': function (event,template) {


    // AutoForm.submitFormById("#signupform");
    var role = template.chosenRole.get();
    if(role == ""){
        toastr.info('Tell us whether you are a teacher, student or parent!');
        return;
    }
    var userObj = {};
    userObj.profile = {};
    userObj.email = $(".email").val();
    userObj.profile.firstName = $(".fn").val();
    userObj.profile.lastName = $(".ln").val();
    userObj.profile.role = role;
    userObj.dob = $("#dobInput").val() || "";

    //if () {
    if (!Smartix.helpers.validateEmail(userObj.email)) {
      toastr.error("Incorrect Email");
    } else if ($(".pwd").val().length < 4) {
      toastr.error("At least 4 characters Password");
    } else {
        Smartix.Accounts.createUser(userObj.email, {
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
