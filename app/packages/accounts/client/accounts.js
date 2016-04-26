Smartix = Smartix || {};

Smartix.Accounts = Smartix.Accounts || {};

Smartix.Accounts.registerOrLoginWithGoogle = function () {
  Meteor.loginWithGoogle(
    {
      forceApprovalPrompt: true,
      requestPermissions: ['email'],
      loginStyle: 'popup',
      requestOfflineToken: true
    }
    , function (err) { // <-- the callback would NOT be called. It only works if loginStyle is popup
      //see https://github.com/meteor/meteor/blob/devel/packages/accounts-oauth/oauth_client.js Line 16
      var loginServicesConfigured = Accounts.loginServicesConfigured();
      console.log('loginServicesConfigured=' + loginServicesConfigured);
      if (err) {
        // set a session variable to display later if there is a login error
        Session.set('loginError', 'reason: ' + err.reason + ' message: ' + err.message || 'Unknown error');
        //alert(err.message + ":" + err.reason);
        toastr.error('Sorry. '+err.reason);
        console.log('login:google:' + err.reason + " msg=" + err.message);
      }
    });
};