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
  api.addFiles('newsgroups.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:newsgroups');
  api.addFiles('newsgroups-tests.js');
});
