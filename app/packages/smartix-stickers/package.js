Package.describe({
  name: "smartix:stickers",
  summary: "",
  version: "0.0.1",
});

Package.onUse(function(api) {
     api.versionsFrom("1.2");
     api.use('ecmascript');
     api.use('iron:router');
     api.use('reactive-var','client');
     api.use('session', 'client');
     api.use('templating', 'client');
     api.use('stevezhu:lodash@4.6.1');

    api.use('smartix:core');
   
    api.addFiles('route.js');

    api.addFiles('api.js', 'server');
    api.addFiles('stickers.js', 'server');
    api.addFiles('client/stickers_awarded.html', 'client');
    api.addFiles('client/stickers_awarded.js', 'client');
   
    api.export('Smartix');
});