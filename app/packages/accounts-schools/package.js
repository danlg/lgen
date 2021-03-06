Package.describe({
  name: 'smartix:accounts-schools',
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
  api.use('random');
  api.use('check');
  api.use('ecmascript');
  api.use('stevezhu:lodash@4.6.1');
  api.use('aldeed:simple-schema');
  api.use('alanning:roles');
  api.use('momentjs:moment@2.13.1');
  api.use('smartix:utilities');
  api.use('smartix:core');
  
  //retrieve user schema
  // api.use('smartix:accounts-global');
  //generate username
  api.use('smartix:accounts-usernames');      
  api.use('smartix:accounts-system');
  api.use('smartix:accounts-relationships');
  api.use('smartix:schools@0.0.1');
  api.addFiles('lib/strings.js', ['client', 'server']);
  api.addFiles('lib/accounts-schools.js', ['client', 'server']);
  api.addFiles('client/accounts-schools.js', ['client']);

  api.addFiles('server/accounts-schools.js', 'server');
  api.addFiles('server/import_students.js', 'server');
  api.addFiles('server/import_parents.js', 'server');
  api.addFiles('server/import_teachers.js', 'server');
  api.addFiles('server/methods.js', 'server');
  api.addFiles('server/publications.js', 'server');
      
  api.export('Smartix');
});