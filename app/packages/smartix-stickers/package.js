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

    api.addFiles('api.js', 'server');
    api.addFiles('stickers.js', 'server');

    //  api.addFiles('general_message_sender.js','client');
    //  api.addFiles('send_message.css','client');
    //  api.addFiles('send_message.html','client');
    //  api.addFiles('send_message.js','client');     
    //  api.addFiles('stickers_tab.html','client');
    //  api.addFiles('stickers_tab.js','client');

    // //  api.addFiles('method.js','server');    
    //  api.addFiles('route.js');
     
    //  api.export('GeneralMessageSender');
    api.export('Smartix');
});