Router.route('/email-reset-password', {
  name: "EmailResetPwd"
});

Router.route('/email-forget-password', {
  name: "EmailForgetPwd"
});

Router.route('/login', {
  name: "EmailSignin"
});
Router.route('/signup', {
  name: "EmailSignup"
});

Router.route('Dob');

Router.route('EmailVerification');

Router.route('/',{
    name: "LoginSplash"
})