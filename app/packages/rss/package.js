Package.describe({
  name: 'smartix:rss',
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
  api.use('aldeed:simple-schema');
  api.use('stevezhu:lodash@4.6.1');
  api.use('smartix:core');
  api.use('danielqiu:feed');
  api.addFiles('lib/rss.js', ['client', 'server']);
  api.addFiles('server/startup.js', 'server');
  api.addFiles('server/rss.js', 'server');
  api.addFiles('server/methods.js', 'server');
  api.addFiles('server/publications.js', 'server');
  api.addFiles('server/parser.js', 'server');
  api.addFiles('client/rss.js', 'client');
  api.export('Smartix');
});