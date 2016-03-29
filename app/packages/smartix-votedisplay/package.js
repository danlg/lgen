Package.describe({
  name: "smartix:votedisplay",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});


Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     api.addFiles('vote_display.css','client');
     api.addFiles('vote_display.html','client');
     api.addFiles('vote_display.js','client');     
   
});