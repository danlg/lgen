Package.describe({
    name: 'smartix:calendar',
    version: '0.0.1',
    summary: 'Calendar Database for the Smartix platform.',
    git: '',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');

    api.use('ecmascript');
    api.use('jquery');    
    api.use('check');
    api.use('splendido:accounts-meld');
    api.use('accounts-base');
    api.use('stevezhu:lodash@4.6.1');
    api.use('alanning:roles');

    //template dependency
    api.use('tap:i18n');
    api.use('templating');
    api.use('fourseven:scss','client');
    api.use('iron:router');
    api.use('aldeed:collection2');
    api.use('aldeed:simple-schema');
    api.use('reactive-var', 'client');
    api.use('session');
    api.use('smartix:core');
    api.use('smartix:lib');
    
    api.use('smartix:utilities');

    api.addFiles('lib/calendar_collections.js', ['server', 'client']);

    api.addFiles('server/calendar.js', 'server');
    api.addFiles('server/api.js', 'server');

    api.export('Smartix');

    // api.addFiles('server/methods.js', 'server');    
});
