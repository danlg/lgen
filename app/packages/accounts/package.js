Package.describe({
    name: 'smartix:accounts',
    version: '0.0.1',
    summary: 'Account Management for the Smartix platform.',
    git: '',
    documentation: 'README.md'
});


Npm.depends({
   'blob-util': "1.2.1",
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');

    api.use('ecmascript');
    api.use('jquery');    
    api.use('check');
    api.use('splendido:accounts-meld');
    api.use('accounts-base');
    //api.use('accounts-google');
    //api.use('accounts-oauth');
    api.use('stevezhu:lodash@4.6.1');
    api.use('accounts-password');
    api.use('alanning:roles');

    //template dependency
    api.use('tap:i18n@1.8.0');
    api.use('templating');
    api.use('fourseven:scss@2.0.0','client');    
    api.use('iron:router');
    api.use('aldeed:collection2');
    api.use('aldeed:simple-schema');
    api.use('reactive-var', 'client');
    api.use('session');
    api.use('smartix:core');
    api.use('smartix:lib');

    // template dependency ends
    api.use('smartix:accounts-system');
    api.use('smartix:accounts-global');
    api.use('smartix:accounts-schools');
    api.use('smartix:accounts-usernames');
    
    api.use('smartix:utilities');

    // temporary comment out, as there is circular dependency
    api.use('smartix:schools', null, { unordered: true });

    api.addFiles('lib/accounts.js', ['client', 'server']);
    api.addFiles('client/accounts.js', 'client');
    api.addFiles('server/core-config.js', 'server');
    api.addFiles('server/accounts.js', 'server');
    api.addFiles('server/publications.js', 'server');
    api.addFiles('server/methods.js', 'server');


    api.addFiles([
        'client/templates/login_splash/login.html',
        'client/templates/login_splash/login.css',
        'client/templates/login_splash/login.js',
        'client/templates/login_splash/loginResponsiveImageLandscape.css',
        'client/templates/login_splash/loginResponsiveImagePotrait.css'
    ], 'client');

    api.addFiles([
        'client/templates/dob/dob.html',
        'client/templates/dob/dob.js'
    ], 'client');

    api.addFiles([
        'client/templates/email_signin/email_signin.html',
        'client/templates/email_signin/email_signin.js'
    ], 'client');

    api.addAssets(['client/asset/iphone6s-plus-silver-vertical.png',
                   'client/asset/graduation_ceremony_picture@1x.jpg',
                   'client/asset/hbs_logo.svg', 'client/asset/smartix_logo.png'],'client');
                   
    api.addFiles(['lib/vendor/spectrum/spectrum.js',
                  'lib/vendor/spectrum/spectrum.css'],'client');
    api.addFiles([
        'client/templates/signup/signup_main.html',
        'client/templates/signup/signup_main.js',
        'client/templates/signup/signup_main.css',
        'client/templates/signup/school_signup_form.html',        
        'client/templates/signup/school_signup_form.js',
        'client/templates/signup/school_signup_form2.html',
        'client/templates/signup/individual_signup.html'
    ], 'client');


    api.addFiles([
        'client/templates/email_verification/email_verification.html',
        'client/templates/email_verification/email_verification.js'
        ], 'client');

    api.addFiles([
        'client/templates/email_forgetpwd/email_forgetpwd.html',
        'client/templates/email_forgetpwd/email_forgetpwd.js'
        ], 'client');

    api.addFiles([
        'client/templates/email_resetpwd/email_resetpwd.html',
        'client/templates/email_resetpwd/email_resetpwd.js'
        ], 'client');

    api.addFiles([
        'client/templates/school_pick/school_pick.html',
        'client/templates/school_pick/school_pick.js'
        ], 'client');

    api.addFiles([
        'client/templates/my_account/my_account.html',
        'client/templates/my_account/my_account.js'
        ], 'client');

    api.addFiles([
        'client/templates/overview_fake/overview_fake.html',
        'client/templates/overview_fake/overview_fake.scss',
        'client/templates/overview_fake/overview_fake.js'
        ], 'client');
        
    api.addFiles('lib/routes.js', ['client', 'server']);
    api.addFiles('client/init.js', 'client');
    
    api.export('Smartix');
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('smartix:accounts');
    api.addFiles('accounts-tests.js');
});
