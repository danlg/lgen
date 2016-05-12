Template.EmailResetPwd.events({
  'click .reset-password-btn': function(e, t) {
    e.preventDefault();
    
    var resetPasswordForm = $(e.currentTarget),
        password = $('#resetPasswordPassword').val(),
        passwordConfirm = $('#resetPasswordPasswordConfirm').val();
       
      if(password == passwordConfirm){
        if(password.length < 4){
            toastr.info(TAPi18n.__("PasswordNotEnoughLength"))
            log.info('At least 4 characters Password');
        }else{
            Accounts.resetPassword(Session.get('resetPasswordToken'), password, function(err) {
                if (err) {
                    log.info('We are sorry but something went wrong.');             
                    Session.clear();
                    Router.go('LoginSplash');

                } else {
                    toastr.info(TAPi18n.__("PasswordChanged"));
                    log.info('Your password has been changed. Welcome back!');
                    Session.set('resetPasswordToken', null);
                    Smartix.helpers.routeToTabClasses();
                }
            });
        }            
      }else{
          toastr.info(TAPi18n.__("PasswordNotTheSame"))    
      }
 
    return false;
  }
});

Template.EmailResetPwd.onCreated(function(){
    log.info('EmailResetPwd:onCreated');
})