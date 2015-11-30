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