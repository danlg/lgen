Meteor.startup(function () {
    
    Accounts.onResetPasswordLink(function(token, done) {
        Session.set('resetPasswordToken', token);
        Router.go('EmailResetPwd');
    });

    Accounts.onEnrollmentLink(function(token, done) {
        Session.set('resetPasswordToken', token);
        Router.go('EmailResetPwd');
    });
});