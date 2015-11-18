/*****************************************************************************/
/* Login: Event Handlers */
/*****************************************************************************/

Template.Login.events({
  'click .gmailLoginBtn': function () {
    log.info("Meteor user /logged in ?");
    log.info( Meteor.user());
    //if (!
    //for details see, http://www.helptouser.com/code/29008008-meteor-js-google-account-filter-email-and-force-account-choser.html
    //and also https://github.com/meteor/meteor/wiki/OAuth-for-mobile-Meteor-clients
    
    
    Meteor.loginWithGoogle(
      {
        forceApprovalPrompt: true,
        requestPermissions: ['email'],
        loginStyle: 'popup',
        requestOfflineToken: true
      }
      ,function (err) { // <-- the callback would NOT be called. It only works if loginStyle is popup
                        //see https://github.com/meteor/meteor/blob/devel/packages/accounts-oauth/oauth_client.js Line 16
       
        if (err) {
          // set a session variable to display later if there is a login error
          Session.set('loginError', 'reason: ' + err.reason + ' message: ' + err.message || 'Unknown error');
          alert(err.message + ":" + err.reason);
          log.error('loginWithGoogle err'+ err.reason +" msg="+ err.message);
          var loginServicesConfigured = Accounts.loginServicesConfigured();
          log.info('loginServicesConfigured='+loginServicesConfigured);
        }
        else {
          log.info('loginWithGoogle OK');
          var loginServicesConfigured = Accounts.loginServicesConfigured();
          log.info('loginServicesConfigured='+loginServicesConfigured);

          log.info(Meteor.user())
          
          if (Meteor.user().profile.role !== ""){
            log.info("user has role")
            routeToTabClassesOrClassDetail();
          }
          else{
            //first time user
            log.info("user does not have role")
            Router.go('role');
          }
        }
      });
    //)
    //{
    //    if (Meteor.user().profile.role !== "")
    //        Router.go('TabClasses');
    //    else
    //        Router.go('role');
    //}
    //else{
    //    log.error("Shouldn't go here");
    //}
  }
});

/*****************************************************************************/
/* Login: Helpers */
/*****************************************************************************/
Template.Login.helpers({});

/*****************************************************************************/
/* Login: Lifecycle Hooks */
/*****************************************************************************/
Template.Login.created = function () {
  // alert("created");
  if (Meteor.userId()) {
     //debugger;
     Router.go('TabClasses');
     
  }
};

Template.Login.rendered = function () {
  // videojs('bg-video').Background();
  // alert("rendered");
};

Template.Login.destroyed = function () {
};
