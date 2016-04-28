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
  api.use('templating'); 
  api.use('iron:router');
  api.use('aldeed:simple-schema');     
  api.use('aldeed:collection2');

  api.use('alanning:roles@1.2.15');
  api.use('reactive-var','client');
  
  api.use('smartix:accounts', null, {unordered:true});
  api.use('smartix:accounts-schools', {unordered: true});
  api.use('smartix:accounts-system');
  api.use('easy:search');
  api.addFiles('strings.js');
  api.addFiles('reserved-school-names.js');  
  api.addFiles('schools.js');
  api.addFiles('server/methods.js', 'server');
  api.addFiles('client/helpers.js','client');
  api.addFiles('publications.js','server');
  
  api.addFiles('routes.js');
  api.addFiles(['client/templates/edit_school.html',
                'client/templates/edit_school.js']
               ,'client');
   
  api.export('SmartixSchools', ['client']);
  api.export('SmartixSchoolsCol', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartix:schools');
  api.addFiles('schools-tests.js');
});
