Package.describe({
  name: "smartix:notifications",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});

Package.onUse(function(api) {
     api.versionsFrom("1.2"); 
     api.use('mongo');
     api.use([
         "templating",
         "underscore",
         "fastclick",
         "iron:router",
         "tracker",
         "session",
         "jquery"
     ], "client");
     api.use('smartix:ui-master', 'client');
     api.use('smartix:lib','client');
     
     api.use('practicalmeteor:loglevel')
     api.addFiles('notifications.js');
     api.addFiles('init.js','client');         
     api.addFiles('publications.js', 'server');
     api.addFiles('methods_cs.js');
     api.export('Notifications');

});