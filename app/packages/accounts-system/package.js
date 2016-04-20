Package.describe({
  name: 'smartix:accounts-system',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('random');
  api.use('check');
  api.use('ecmascript');
  api.use('accounts-base');
  api.use('accounts-password');
  api.use('smartix:core');  
  api.use('alanning:roles');
  api.use('stevezhu:lodash@4.6.1');
  api.addFiles('lib/strings.js');
  api.addFiles('server/accounts-system.js');
  api.addFiles('server/methods.js');
  api.addFiles('server/startup.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:accounts-system');
  api.addFiles('accounts-system-tests.js');
});
