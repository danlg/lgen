Package.describe({
  name: 'smartix:messages',
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
  api.use('mongo');
  api.use('stevezhu:lodash@4.6.1');
  api.use('aldeed:simple-schema');
  api.use('smartix:utilities');
  //use smartix core as Smartix namespace is init there
  api.use('smartix:core') 


  api.addFiles('messages.js');
  api.addFiles('methods.js');
  api.addFiles('publications.js','server');  
  api.use('smartix:messages-addons@0.0.1', {unordered: true});    
  api.use('smartix:messages-text', {unordered: true});
  api.use('smartix:messages-article', {unordered: true});
   
  api.export('Smartix');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:messages');
  api.addFiles('messages-tests.js');
});
