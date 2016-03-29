Package.describe({
  name: "smartix:classes",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});

Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('tap:i18n');
     api.use('aldeed:collection2');
     api.use('aldeed:simple-schema');
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     api.addFiles('classes.js');
     api.addFiles('namespace.js');  
     api.addFiles('publications.js','server');
     
     api.export('Classes');
});