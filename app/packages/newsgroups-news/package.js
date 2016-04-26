Package.describe({
    name: 'smartix:newsgroups-news',
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
    api.use('ecmascript');
    api.use('smartix:utilities');
    api.use('smartix:classes');
    api.use('smartix:messages');
    api.addFiles('newsgroups-news.js');
    //api.addFiles('publications.js','server');
    api.export('Smartix');
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('smartix:classes-announcements');
    api.addFiles('classes-announcements-tests.js');
});
