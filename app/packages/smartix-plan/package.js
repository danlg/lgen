Package.describe({
  name: 'smartix:plan',
  version: '0.0.1',
  summary: 'School Plan Management for the Smartix platform.',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('templating'); 
  api.use('aldeed:simple-schema');
  api.use('aldeed:collection2');

  api.addFiles('smartix-plan.js', 'server');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:plan');
});
