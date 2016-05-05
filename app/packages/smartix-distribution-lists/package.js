Package.describe({
    name: 'smartix:distribution-lists',
    version: '0.0.1',
    summary: 'Allows the grouping of users.',
    git: '',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.use('check');
    api.use('iron:router');
    api.use('templating');
    api.use('aldeed:collection2');
    api.use('aldeed:simple-schema');
    api.use('stevezhu:lodash@4.6.1');
    
    api.use('smartix:utilities');
    api.use('smartix:core');
    api.use('smartix:lib');
    api.use('smartix:accounts@0.0.1');
    api.use('smartix:accounts-utilities@0.0.1');
    api.use('smartix:accounts-schools@0.0.1');
    api.use('smartix:groups@0.0.1');
    api.addFiles('lib/schema.js', ['client', 'server']);
    api.addFiles('server/distribution-lists.js', 'server');
    api.addFiles('server/methods.js', 'server');
    api.addFiles('server/publications.js', 'server');
    
    api.export('Smartix');
});