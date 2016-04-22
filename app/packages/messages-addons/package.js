Package.describe({
  name: 'smartix:messages-addons',
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
  api.use('smartix:utilities');
  api.use('aldeed:simple-schema');
  api.use('smartix:core');
  api.use('smartix:messages-addons-documents');
  api.use('smartix:messages-addons-images');   
  api.use('smartix:messages-addons-calendar');      
  api.use('smartix:messages-addons-poll');
  api.use('smartix:messages-addons-comment');
      
  api.addFiles('messages-addons.js');
  api.export('Smartix');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:messages-addons');
  api.addFiles('messages-addons-tests.js');
});
