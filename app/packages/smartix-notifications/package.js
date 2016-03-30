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
        
     api.addFiles('notifications.js');
     //api.addFiles('init.js','client');         
     api.addFiles('publications.js','server');
                                           
     api.export('Notifications');

});