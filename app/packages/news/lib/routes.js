Router.route('/newsgroups/news/list', {
    name: 'newsgroups.news.list',
    layoutTemplate: 'AppLayout',
    template: 'NewsgroupsNewsList',
    action: function () {
        this.render('NewsgroupsNewsList');
    }
});

Router.route('/newsgroups/news/view/:msgid', {
    name: 'newsgroups.news.view',
    layoutTemplate: 'AppLayout',
    template: 'NewsgroupsNewsView',
    action: function () {
        this.render('NewsgroupsNewsView');
    }
});