Package.describe({
  name: 'smartix:accounts-global',
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
  api.use('ecmascript');
  api.use('accounts-base');
  api.use('accounts-password');
  api.use('accounts-google');  
  api.use('alanning:roles');
  api.use('stevezhu:lodash@4.6.1');
  api.use('smartix:core'); 
  api.use('smartix:accounts-usernames');
  api.addFiles('accounts-global.js');
  api.addFiles('publications.js','server');
  api.export('Smartix');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');

         
  api.use('smartix:accounts-global');
  api.addFiles('accounts-global-tests.js');
});
