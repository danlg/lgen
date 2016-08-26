Router.route('/:school/attendance/home', {
    name: 'attendance.home',
    layoutTemplate: 'AppLayout',
    template: 'AttendanceHome',
    action: function () {
        this.render('AttendanceHome');
    }
});

Router.route('/:school/attendance/:classCode/rollCall', {
    name: 'attendance.teacher.class',
    layoutTemplate: 'AppLayout',
    template: 'ClassAttendance',
    action: function () {
        this.render('ClassAttendance');
    }
});


Router.route('/:school/attendance/list', {
    name: 'attendance.list',
    layoutTemplate: 'AppLayout',
    template: 'AttendanceList',
    action: function () {
        this.render('AttendanceList');
    }
});

Router.route('/:school/attendance/view/:msgid', {
    name: 'attendance.view',
    layoutTemplate: 'AppLayout',
    template: 'AttendanceView',
    action: function () {
        this.render('AttendanceView');
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