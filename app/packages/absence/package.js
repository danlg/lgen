Package.describe({
  name: 'smartix:absence',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

 Npm.depends({
     jszip: "3.0.0",
     xlsx: "https://github.com/d4nyll/js-xlsx/archive/36e68fcc15a71f49fea4e73f8bc15ff4acbaa34e.tar.gz"
 });

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('check');
  api.use('mongo');
  api.use('aldeed:simple-schema');
  api.use('momentjs:moment@2.13.1');
  api.use('smartix:core');
  api.addFiles('lib/collections.js', ['client', 'server']);
  api.addFiles('server/permissions.js', ['server']);
  api.addFiles('server/expected/permissions.js', ['server']);
  api.addFiles('server/expected/expected.js', ['server']);
  api.addFiles('server/expected/methods.js', ['server']);
  api.addFiles('server/expected/publications.js', ['server']);
  api.addFiles('server/actual/actual.js', ['server']);
  api.addFiles('server/actual/methods.js', ['server']);
  api.addFiles('client/absence.js', ['client']);
  api.export('Smartix');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:absence');
  api.addFiles('absence-tests.js');
});
