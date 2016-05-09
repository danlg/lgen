Router.route('/:school/attendance/list', {
    name: 'attendance.list',
    layoutTemplate: 'AppLayout',
    template: 'AttendaceList',
    action: function () {
        this.render('AttendaceList');
    }
});

Router.route('/:school/attendance/view/:msgid', {
    name: 'attendance.view',
    layoutTemplate: 'AppLayout',
    template: 'AttendaceView',
    action: function () {
        this.render('AttendaceView');
    }
});


Router.route('/:school/attendance/leave-application', {
    name: 'attendance.add',
    layoutTemplate: 'AppLayout',
    template: 'AttendanceRecordAdd',
    action: function () {
        this.render('AttendanceRecordAdd');
    }
});