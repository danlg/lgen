/*****************************************************************************/
/* Login: Event Handlers */
/*****************************************************************************/

Template.Login.events({
    'click .gmailLoginBtn': function () {
        console.log("Meteor user /logged in ?"+Meteor.user());
        //if (!
        //for details see, http://www.helptouser.com/code/29008008-meteor-js-google-account-filter-email-and-force-account-choser.html
                Meteor.loginWithGoogle(
            {
                forceApprovalPrompt: true,
                requestPermissions: ['email'],
                loginStyle: 'popup',
                requestOfflineToken: true
            }
            , function (err) {
                if (err){
                    // set a session variable to display later if there is a login error
                    Session.set('loginError', 'reason: ' + err.reason + ' message: ' + err.message || 'Unknown error');
                    alert(err.message + ":" + err.reason);

                }

                else {
                    if (Meteor.user().profile.role !== "")
                        Router.go('TabClasses');
                    else
                        Router.go('role');
                }
            })
        //)
        //{
        //    if (Meteor.user().profile.role !== "")
        //        Router.go('TabClasses');
        //    else
        //        Router.go('role');
        //}
        //else{
        //    console.log("Shouldn't go here");
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

};

Template.Login.rendered = function () {
    // videojs('bg-video').Background();
};

Template.Login.destroyed = function () {
};
