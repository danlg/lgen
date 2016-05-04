Template.EmailResetPwd.events({
  'click .reset-password-btn': function(e, t) {
    e.preventDefault();
    
    var resetPasswordForm = $(e.currentTarget),
        password = $('#resetPasswordPassword').val(),
        passwordConfirm = $('#resetPasswordPasswordConfirm').val();
       
      if(password == passwordConfirm){
        if(password.length < 4){
            toastr.info(TAPi18n.__("PasswordNotEnoughLength"))
            console.log('At least 4 characters Password');
        }else{
            Accounts.resetPassword(Session.get('resetPasswordToken'), password, function(err) {
                if (err) {
                    console.log('We are sorry but something went wrong.');
                } else {
                    toastr.info(TAPi18n.__("PasswordChanged"));
                    console.log('Your password has been changed. Welcome back!');
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
    console.log('EmailResetPwd:onCreated');
})