Package.describe({
  name: "smartix:calendarevent",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});


Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     api.addFiles('calendar_event.html','client');
     api.addFiles('calendar_event.js','client');  
});