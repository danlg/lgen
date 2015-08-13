Accounts.onEmailVerificationLink(function(token){
  Accounts.verifyEmail(token, function(err){
    err?alert(err):Router.go('Home');
    })
  })
