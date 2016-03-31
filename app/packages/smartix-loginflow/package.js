Package.describe({
  name: "smartix:loginflow",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});


Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('iron:router');
     api.use('tap:i18n');
     api.use('aldeed:collection2');
     api.use('aldeed:simple-schema');
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     api.use('smartix:lib');
     
     api.addFiles('route.js');
     api.addFiles('methods.js','server');
     
     api.addFiles(['components/dob/dob.html',
                   'components/dob/dob.js'],'client');

     api.addFiles(['components/email_signin/email_signin.html',
                   'components/email_signin/email_signin.js'],'client');
      
     api.addFiles(['components/email_signup/email_signup.html',
                   'components/email_signup/email_signup.js',
                   'components/email_signup/email_signup.css',
                  ],'client');

     api.addFiles(['components/email_verification/email_verification.html',
                   'components/email_verification/email_verification.js'],'client');

     api.addFiles(['components/email_forgetpwd/email_forgetpwd.html',
                   'components/email_forgetpwd/email_forgetpwd.js'],'client');

     api.addFiles(['components/email_resetpwd/email_resetpwd.html',
                   'components/email_resetpwd/email_resetpwd.js'],'client');
                                                        
});