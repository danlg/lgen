Router.route('/newsgroups/news/list', {
    name: 'newsgroups.news.list',
    layoutTemplate: 'AppLayout',
    template: 'NewsgroupsNewsList',
    action: function () {
        this.render('NewsgroupsNewsList');
    }
});