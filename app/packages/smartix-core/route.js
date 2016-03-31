Router.route('About',{
  path:"about"
});

Router.route('PrivacyPolicy',{
  path:"privacy-policy"
});

Router.route('TermsOfService',{
  path:"terms-of-service"
});

Router.route('Help',{
  path:"help"
});

Router.route('Feedback', {
  path:"feedback"
});

Router.route('Login', {
  path: "/login",
  waitOn:function () {
    Accounts.loginServicesConfigured();
  }
});

Router.route('Report',{
  path: "report"
});