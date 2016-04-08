/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* EmailSignup: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailVerification.created = function () {

};

Template.EmailVerification.rendered = function () {
 
  //this page would be redirected by reactivity depend on verified Boolean of the email
  var self = this;
  self.autorun(function() {
      if(Meteor.user().emails[0].verified){    
         Smartix.helpers.routeToTabClasses();
     }
   });
};
Template.EmailVerification.destroyed = function () {};

Template.EmailVerification.events({
  'click .resendVerifyEmail': function(event,template){
      log.info('clicked');
      log.info(Meteor.userId());
      Meteor.call('resendVerificationEmail');
  }
  , 'click .updateEmailBtn': function(event,template){
     var updateEmail = $('.updateEmail').val();
      log.info('clicked');
      log.info(Meteor.userId());
      Meteor.call('resendVerificationEmail',updateEmail);
   }
   , 'click .signOut': function () {
    Meteor.logout(
      function (err) {
        //remove all session variables when logout
        Session.clear();          
        Router.go('LoginSplash');
      }
    );
  }
  
});

Template.EmailVerification.helpers({
   
   unverifyEmail: function(){
       return Meteor.user().emails[0].address;
   }
      
});