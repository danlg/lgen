Package.describe({
  name: 'smartix:groups',
  version: '0.0.1',
  summary: 'Internal package. Provides the concept of groups to other packages such as `smartix:newsgroups` and `smartix:classes`.',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('mongo');
  api.use('check');
  api.use('accounts-base');
  
  //use smartix core as Smartix namespace is init there
  api.use('smartix:core')
  api.use('stevezhu:lodash@4.6.1');
  api.use('smartix:accounts@0.0.1');
  api.addFiles('groups.js');
  
  //export Smartix so that Smartix.Groups is available
  api.export('Smartix');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:groups');
  api.addFiles('groups-tests.js');
});
