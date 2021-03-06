Package.describe({
  name: 'smartix:messages-text',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('stevezhu:lodash@4.6.1');
  api.use('aldeed:simple-schema'); 
  api.use('smartix:core');
  api.use('smartix:messages-schema');  
  api.addFiles('messages-text.js');
  api.export('Smartix');  
  
  
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:messages-text');
  api.addFiles('messages-text-tests.js');
});
