Router.route('/calendar/list', {
    name: 'calendar.list',
    layoutTemplate: 'AppLayout',
    template: 'CalendarListView',
    action: function () {
        this.render('CalendarListView');
    }
});