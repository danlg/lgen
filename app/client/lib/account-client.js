Accounts.onEmailVerificationLink(function(token){
  console.log('lVerification');
  Accounts.verifyEmail(token, function(err){
    err?alert(err):Router.go('home');
    })
  })
