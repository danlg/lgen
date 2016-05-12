Router.route('/:school/attendance/home', {
    name: 'attendance.home',
    layoutTemplate: 'AppLayout',
    template: 'AttendanceHome',
    action: function () {
        this.render('AttendanceHome');
    }
});

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

Router.route('/:school/attendance/leave-application/:processId', {
    name: 'attendance.addByProcess',
    layoutTemplate: 'AppLayout',
    template: 'AttendanceRecordAddByProcess',
    action: function () {
        this.render('AttendanceRecordAddByProcess');
    }
});