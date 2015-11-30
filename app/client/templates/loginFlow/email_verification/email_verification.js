/*****************************************************************************/
/* EmailSignup: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailVerification.created = function () {

   if(Meteor.user().emails[0].verified){    
         routeToTabClasses();
   }
 
};

Template.EmailVerification.rendered = function () {};
Template.EmailVerification.destroyed = function () {};

Template.EmailVerification.events({
      
   'click .resendVerifyEmail': function(event,template){
      log.info('clicked');
      log.info(Meteor.userId());
      Meteor.call('resendVerificationEmail');
   },
   'click .updateEmailBtn': function(event,template){
     var updateEmail = $('.updateEmail').val();
      log.info('clicked');
      log.info(Meteor.userId());
      Meteor.call('resendVerificationEmail',updateEmail);
   }
   ,
  'click .signOut': function () {
    Meteor.logout(
      function (err) {
        Router.go('Login');
      }
    );
  },
  
});

Template.EmailVerification.helpers({
   
   unverifyEmail: function(){
       
       return Meteor.user().emails[0].address
   }
      
});