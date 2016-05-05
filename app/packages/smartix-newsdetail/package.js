Package.describe({
  name: "smartix:newsdetail",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});


Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     //api.use('smartix:notifications');     
     api.addFiles('news_detail.html','client');
     api.addFiles('news_detail.js','client');  
});