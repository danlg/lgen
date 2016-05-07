Router.route('/attedance/list', {
    name: 'attedance.list',
    layoutTemplate: 'AppLayout',
    template: 'AttendaceList',
    action: function () {
        this.render('AttendaceList');
    }
});

Router.route('/attedance/view/:msgid', {
    name: 'attedance.view',
    layoutTemplate: 'AppLayout',
    template: 'AttendaceView',
    action: function () {
        this.render('AttendaceView');
    }
});