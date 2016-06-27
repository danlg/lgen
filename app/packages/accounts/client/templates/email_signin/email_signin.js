/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/* EmailSignin: Event Handlers */
Template.EmailSignin.events({
  'input #email':function(event,template){
      template.email.set($("#email").val());
  },
  'input #password':function(event,template){
      template.password.set($("#password").val());
  },
  'click .loginBtn': function (event,template) {
    Meteor.loginWithPassword(template.email.get(), template.password.get(), function (err) {
      if (err){
        toastr.error(err.reason);
        log.error(err);
      }
      else {
        log.info("login:meteor:" + Meteor.userId());
        Smartix.helpers.routeToTabClasses();
      }
    });
  },
  'click .forget-password-btn':function(event,template){
      Router.go('EmailForgetPwd');
  },
  'click .google-login-btn':function(event,template){
    Smartix.Accounts.registerOrLoginWithGoogle();
  }    
});

/* EmailSignin: Helpers */
Template.EmailSignin.helpers({});

/* EmailSignin: Lifecycle Hooks */
Template.EmailSignin.onCreated( function() {
    this.email = new ReactiveVar("");
    this.password = new ReactiveVar("");
    if (Meteor.userId()) {
      Smartix.helpers.routeToTabClasses(); 
    }
});

Template.EmailSignin.onRendered( function() {
});

Template.EmailSignin.destroyed = function () {
};

