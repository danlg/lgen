Package.describe({
  name: 'smartix:accounts-global',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('check');
  api.use('ecmascript');
  api.use('accounts-base');
  api.use('accounts-password');
  api.use('accounts-google');  
  api.use('alanning:roles');
  api.use('stevezhu:lodash@4.6.1');
  api.use('smartix:core'); 
  api.use('smartix:accounts-usernames');
  api.use('okgrow:analytics@1.0.5');
  api.use('smartix:accounts-system');
  api.addFiles('server/accounts-global.js', 'server');
  api.addFiles('publications.js','server');
  api.export('Smartix');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');

         
  api.use('smartix:accounts-global');
  api.addFiles('accounts-global-tests.js');
});
