Package.describe({
  name: "smartix:messageextrainfo",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});


Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     api.addFiles('message_detail.css','client');
     api.addFiles('message_detail.html','client');
     api.addFiles('message_detail.js','client');     
});