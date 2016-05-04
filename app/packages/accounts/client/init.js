
// set done as a variable to pass
var doneCallback;

Accounts.onResetPasswordLink(function(token, done) {
    Session.set('resetPasswordToken', token);
    log.info('onResetPasswordLink:try to route you to EmailResetPwd')
    doneCallback = done;
});

Accounts.onEnrollmentLink(function(token, done) {
    Session.set('resetPasswordToken', token);
    
    log.info('onEnrollmentLink:try to route you to EmailResetPwd')
     doneCallback = done;
});