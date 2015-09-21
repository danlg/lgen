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
    return Router.current().params.role === "Student";
  }

});

/*****************************************************************************/
/* EmailSignup: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailSignup.created = function () {
  $("body").removeClass('modal-open');
};

Template.EmailSignup.rendered = function () {
  /*createVM.bind(this);
   createVM.role(this.data.role);*/

};

Template.EmailSignup.destroyed = function () {
};

Template.ionNavBar.events({
  'click .createBtn': function () {
    /*var userObj =  createVM.toJS();
     Meteor.call('user/create', createVM.toJS(), function(err) {
     err ? alert(err.reason); : Router.go('TabChat');
     });*/

    // AutoForm.submitFormById("#signupform");

    var userObj = {};
    userObj.profile = {};
    userObj.email = $(".email").val();
    userObj.profile.firstname = $(".fn").val();
    userObj.profile.lastname = $(".ln").val();
    userObj.profile.role = Router.current().params.role;
    userObj.profile.dob = $("#dobInput").val() || "";

    if (!validateEmail(userObj.email)) {
      alert("Incorrect Email");
    } else if ($(".pwd").val().length < 4) {
      alert("At least 3 characters Password");
    } else {
      Accounts.createUser({
        email: userObj.email,
        password: $('.pwd').val(),
        profile: userObj.profile
      }, function (err) {
        if (err) {
          alert(err.reason);
          console.log(err);
        } else {
          Router.go("TabClasses");
        }
      });

    }


  }

});
