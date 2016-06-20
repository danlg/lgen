Package.describe({
  name: "smartix:messagedetail",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});


Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('ecmascript');
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     //api.use('smartix:notifications');     
     api.addFiles('message_detail.html','client');
     api.addFiles('message_detail.js','client');  
});