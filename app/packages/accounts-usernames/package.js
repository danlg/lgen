Package.describe({
  name: 'smartix:accounts-usernames',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('smartix:core');
  api.addFiles('accounts-usernames.js');
  
  api.export('Smartix');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:accounts-usernames');
  api.addFiles('accounts-usernames-tests.js');
});
