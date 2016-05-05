Package.describe({
    name: 'smartix:newsgroups',
    version: '0.0.1',
    summary: 'Allows admins of a school to create and manage newsgroups - groups of users which are subscribed to receive certain types of news.',
    git: '',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.use('iron:router');
    api.use('templating');
    api.use('aldeed:collection2');
    api.use('aldeed:simple-schema');
    api.use('stevezhu:lodash@4.6.1');
    
    api.use('smartix:core');
    api.use('smartix:lib');
    api.use('smartix:accounts@0.0.1');
    api.use('smartix:accounts-utilities@0.0.1');
    api.use('smartix:accounts-schools@0.0.1');
    api.use('smartix:groups@0.0.1');
    api.use('smartix:news@0.0.1');  
    api.use('smartix:newsdetail@0.0.1');
    
    api.addFiles('lib/schema.js', ['client', 'server']);
    api.addFiles('lib/routes.js', ['client', 'server']);
    api.addFiles('server/newsgroups.js', 'server');
    api.addFiles('server/methods.js', 'server');
    api.addFiles('server/publications.js', 'server');
    api.addFiles('client/templates/list/list.html', 'client');
    api.addFiles('client/templates/list/list.js', 'client');
    
    api.export('Smartix');
});