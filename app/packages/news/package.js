Package.describe({
  name: 'smartix:news',
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
  api.use('iron:router');
  api.use('templating');
  api.use('aldeed:collection2');
  api.use('aldeed:simple-schema');
  api.use('stevezhu:lodash@4.6.1');    
  api.use('smartix:groups@0.0.1');  
  api.addFiles('news.js');
  

  api.addFiles('lib/routes.js', ['client', 'server']);
  api.addFiles('client/templates/list/list.html', 'client');
  api.addFiles('client/templates/list/list.js', 'client');  

  api.addFiles('client/templates/view/view.html', 'client');
  api.addFiles('client/templates/view/view.js', 'client');    
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:news');
  api.addFiles('news-tests.js');
});
