Package.describe({
  name: 'smartix:accounts',
  version: '0.0.1',
  summary: 'Account Management for the Smartix platform.',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use('ecmascript');
  api.use('accounts-base');
  //api.use('accounts-google');
  //api.use('accounts-oauth');
  api.use('accounts-password'); 
  api.use('alanning:roles');
  
  //template dependency
  api.use('tap:i18n@1.8.0');
  api.use('templating');
  api.use('iron:router');
  api.use('aldeed:collection2');
  api.use('aldeed:simple-schema');
  api.use('reactive-var', 'client');
  api.use('session');  
  api.use('smartix:core');
  //template dependency ends
  
  api.use('smartix:accounts-usernames');
  //temporary comment out, as there is circular dependency
  //api.use('smartix:schools');
  api.addFiles('accounts.js');
  api.addFiles(['templates/login_splash/login.html',
      'templates/login_splash/login.css',
      'templates/login_splash/login.js',
      'templates/login_splash/loginResponsiveImageLandscape.css',
      'templates/login_splash/loginResponsiveImagePotrait.css'], 'client');

  api.addFiles(['templates/dob/dob.html',
      'templates/dob/dob.js'], 'client');

  api.addFiles(['templates/email_signin/email_signin.html',
      'templates/email_signin/email_signin.js'], 'client');

  api.addFiles(['templates/email_signup/email_signup.html',
      'templates/email_signup/email_signup.js',
      'templates/email_signup/email_signup.css',
  ], 'client');

  api.addFiles(['templates/email_verification/email_verification.html',
      'templates/email_verification/email_verification.js'], 'client');

  api.addFiles(['templates/email_forgetpwd/email_forgetpwd.html',
      'templates/email_forgetpwd/email_forgetpwd.js'], 'client');

  api.addFiles(['templates/email_resetpwd/email_resetpwd.html',
      'templates/email_resetpwd/email_resetpwd.js'], 'client');

  api.addFiles(['templates/school_pick/school_pick.html',
      'templates/school_pick/school_pick.js'], 'client');
                                         
  api.addFiles('route.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:accounts');
  api.addFiles('accounts-tests.js');
});
