Package.describe({
    name: 'smartix:messages-addons-poll',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');
    api.use('reactive-var', 'client');
    api.use('session', 'client');
    api.use('templating', 'client');
    api.use('ecmascript');
    api.use('aldeed:simple-schema');
    api.use('stevezhu:lodash@4.6.1');
    api.use('smartix:core');
    api.use('smartix:groups');
    api.use('emojione:emojione@2.1.3');
    api.addFiles('lib/messages-addons-poll.js', ['client', 'server']);
    api.addFiles('client/admin/select-poll/reactions/reactions.html', ['client']);
    api.addFiles('client/admin/select-poll/reactions/reactions.js', ['client']);
    api.addFiles('client/admin/change-vote/change-vote.html', ['client']);
    api.addFiles('client/admin/change-vote/change-vote.css', ['client']);
    api.addFiles('client/admin/change-vote/change-vote.js', ['client']);
    api.addFiles('client/admin/display-vote/display-vote.html', ['client']);
    api.addFiles('client/admin/display-vote/display-vote.css', ['client']);
    api.addFiles('client/admin/display-vote/display-vote.js', ['client']);
    api.addFiles('client/app/change-vote/change-vote.html', ['client']);
    api.addFiles('client/app/change-vote/change-vote.css', ['client']);
    api.addFiles('client/app/change-vote/change-vote.js', ['client']);
    api.addFiles('client/app/display-vote/display-vote.html', ['client']);
    api.addFiles('client/app/display-vote/display-vote.css', ['client']);
    api.addFiles('client/app/display-vote/display-vote.js', ['client']);
    api.addFiles('server/messages-addons-poll.js', ['server']);
    api.addFiles('server/methods.js', ['server']);
    api.export('Smartix');
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('smartix:messages-addons-poll');
    api.addFiles('messages-addons-poll-tests.js');
});
