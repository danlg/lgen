Package.describe({
  name: 'smartix:schools',
  version: '0.0.1',
  summary: 'School Management for the Smartix platform.',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('smartix:accounts');
  api.use('smartix:accounts-schools');
  api.use('smartix:accounts-system');
  api.use('easy:search');
  api.addFiles('schools.js');
  api.export('SmartixSchools', ['client']);
  api.export('SmartixSchoolsCol', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:schools');
  api.addFiles('schools-tests.js');
});
