Template.EmailResetPwd.events({
  'click .reset-password-btn': function(e, t) {
    e.preventDefault();
    
    var resetPasswordForm = $(e.currentTarget),
        password = $('#resetPasswordPassword').val(),
        passwordConfirm = $('#resetPasswordPasswordConfirm').val();
       
      if(password == passwordConfirm){
        if(password.length < 4){
            console.log('At least 4 characters Password');
        }else{
            Accounts.resetPassword(Session.get('resetPasswordToken'), password, function(err) {
                if (err) {
                    console.log('We are sorry but something went wrong.');
                } else {
                    console.log('Your password has been changed. Welcome back!');
                    Session.set('resetPasswordToken', null);
                    routeToTabClasses();
                }
            });
        }            
      }
 
    return false;
  }
});