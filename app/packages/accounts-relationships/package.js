Package.describe({
  name: 'smartix:accounts-relationships',
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
  api.use('templating');
  api.use('aldeed:collection2');
  api.use('aldeed:simple-schema'); 
  api.use('alanning:roles@1.2.15');
  api.use('smartix:accounts-system');
  api.use('smartix:accounts-schools');
  
  api.addFiles('lib/collections.js');
  api.addFiles('server/relationships.js','server');
  api.addFiles('server/methods.js','server');
  api.addFiles('server/publications.js','server');
  
  api.addFiles(['client/templates/related_users_mobile/related_users_mobile.html',
                'client/templates/related_users_mobile/related_users_mobile.js']
               ,'client');
               
  api.export('Smartix');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:accounts-relationships');
  api.addFiles('accounts-relationships-tests.js');
});
