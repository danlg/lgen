Package.describe({
  name: "smartix:lib",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom("1.2");
    api.use('iron:router');
    api.use('smartix:core');
    api.use('templating','client');
    api.use('stevezhu:lodash');
    api.use('smartix:classes');
    api.addFiles('client/helper.js','client');
    api.addFiles('shared/helper.js');
    api.addFiles('shared/find-in-json.js');
    api.addFiles('shared/method_cs.js');
    api.addFiles('server/methods.js','server');
    
    api.export('Smartix');
});