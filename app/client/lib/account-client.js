Accounts.onEmailVerificationLink(function(token){
  Accounts.verifyEmail(token, function(err){
    err?alert(err.reason):Router.go('TabChat');
  });
});


Push.addListener('token', function(token) {
        // Token is { apn: 'xxxx' } or { gcm: 'xxxx' }
        var x={"asd":"asd"};
        console.log(token);
        console.log(x);


});
