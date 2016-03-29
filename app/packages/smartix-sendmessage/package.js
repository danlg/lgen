Package.describe({
  name: "smartix:sendmessage",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});


Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     api.use('smartix:calendarevent');
     api.addFiles('send_message.css','client');
     api.addFiles('send_message.html','client');
     api.addFiles('send_message.js','client');     

     api.addFiles('method.js','server');    
});