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
     api.use('smartix:notifications');     
     api.addFiles('message_extra_info.css','client');
     api.addFiles('message_extra_info.html','client');
     api.addFiles('message_extra_info.js','client');     
});