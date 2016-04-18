Package.describe({
  name: 'smartix:newsgroups',
  version: '0.0.1',
  summary: 'Allows admins of a school to create and manage newsgroups - groups of users which are subscribed to receive certain types of news.',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('aldeed:collection2');
  api.use('aldeed:simple-schema');
  api.use('stevezhu:lodash@4.6.1');
    
  api.use('smartix:accounts@0.0.1');
  api.use('smartix:accounts-schools@0.0.1');
  api.use('smartix:groups@0.0.1');
  api.addFiles('newsgroups.js');
  api.addFiles('methods.js','server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:newsgroups');
  api.addFiles('newsgroups-tests.js');
});
