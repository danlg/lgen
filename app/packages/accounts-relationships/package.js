Package.describe({
  name: 'smartix:accounts-relationships',
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
  api.use('aldeed:collection2');
  api.use('aldeed:simple-schema');  
  api.addFiles('accounts-relationships.js');
  
  api.export('Relationships');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:accounts-relationships');
  api.addFiles('accounts-relationships-tests.js');
});
