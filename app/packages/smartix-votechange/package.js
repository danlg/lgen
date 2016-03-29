Package.describe({
  name: "smartix:votechange",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});


Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     api.addFiles('vote_change.css','client');
     api.addFiles('vote_change.html','client');
     api.addFiles('vote_change.js','client');     
 
});