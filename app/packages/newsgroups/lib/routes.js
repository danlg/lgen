Router.route('/newsgroups/list', {
    name: 'newsgroups.list',
    layoutTemplate: 'AppLayout',
    template: 'NewsgroupsList',
    action: function () {
        this.render('NewsgroupsList');
    }
});