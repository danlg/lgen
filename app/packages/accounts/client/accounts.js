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
        , function (err) { // <-- the callback not called with redirect . It only works if loginStyle is popup
            //see http://docs.meteor.com/#/full/meteor_loginwithexternalservice
            //Arguments
            // callback Function
            // Optional callback. Called with no arguments on success, or with a single Error argument on failure. The callback cannot be called
            // if you are using the "redirect" loginStyle, because the app will have reloaded in the meantime;
            // try using client-side login hooks instead.
            var loginServicesConfigured = Accounts.loginServicesConfigured();
            log.info('loginServicesConfigured=' + loginServicesConfigured);
            if (err) {
                // set a session variable to display later if there is a login error
                Session.set('loginError', 'reason: ' + err.reason + ' message: ' + err.message || 'Unknown error');
                //alert(err.message + ":" + err.reason);
                //toastr.error(TAPi18n.__("Sorry")+' '+err.reason);
                //this happens if we click twice the login button, no consequence as we log anyway
                //no need to warn the user for nothing
                log.error('loginWithGoogle:failed', err);
            }
            else{
                //if login success
                Smartix.helpers.routeToTabClasses();
            }

        });
};