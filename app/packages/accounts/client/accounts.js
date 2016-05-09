Smartix = Smartix || {};

Smartix.Accounts = Smartix.Accounts || {};

Smartix.Accounts.registerOrLoginWithGoogle = function () {

  Meteor.loginWithGoogle(
      {
        forceApprovalPrompt: true,
        requestPermissions: ['email'],
        loginStyle: 'redirect',
        requestOfflineToken: true,
        redirectURL: "/"
      }
    );
};