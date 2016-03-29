Package.describe({
  name: "smartix:userdetail",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});


Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('iron:router');
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     api.use('smartix:classes');
     
     api.addFiles('route.js');
     api.addFiles('user_detail.html','client');
     api.addFiles('user_detail.js','client');     

     
});