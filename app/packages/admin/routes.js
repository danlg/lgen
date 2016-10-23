Router.route('/:school/admin', {
	action: function () {
		this.redirect('/' + this.params.school + '/admin/dashboard');
	}
});

Router.route('/:school/admin/dashboard', {
	name: 'admin.dashboard',
	layoutTemplate: 'adminLayout',
	action: function () {
		this.render('AdminDashboard');
	}
});

Router.route('/:school/admin/users', {
    name: 'admin.users',
    action: function () {
        this.redirect('/' + this.params.school + '/admin/users/list');
    }
});

Router.route('/:school/admin/users/list', {
    name: 'admin.users.list',
    layoutTemplate: 'adminLayout',
    template: 'AdminUsersSearch',
    action: function () {
        this.render('AdminUsersSearch');
    }
});

Router.route('/:school/admin/users/status', {
    name: 'admin.users.status',
    layoutTemplate: 'adminLayout',
    template: 'UserStatusSearch',
    action: function () {
        this.render('UserStatusSearch');
    }
});

Router.route('/:school/admin/users/view/:uid', {
    name: 'admin.users.view',
    layoutTemplate: 'adminLayout',
    template: 'AdminUsersView',
    action: function () {
        this.render('AdminUsersView');
    }
});

Router.route('/:school/admin/users/add', {
    name: 'admin.users.add',
    layoutTemplate: 'adminLayout',
    template: 'AdminUsersAdd',
    action: function () {
        this.render('AdminUsersAdd');
    }
});

Router.route('/:school/admin/users/import/', {
	action: function () {
		this.redirect('/' + this.params.school + '/admin/users/import/students');
	}
});

Router.route('/:school/admin/users/import/students', {
    name: 'admin.users.import.students',
    layoutTemplate: 'adminLayout',
    template: 'AdminUsersImport',
    action: function () {
        this.render('AdminUsersImport');
    }
});

Router.route('/:school/admin/users/import/parents', {
    name: 'admin.users.import.parents',
    layoutTemplate: 'adminLayout',
    template: 'AdminParentsImport',
    action: function () {
        this.render('AdminParentsImport');
    }
});

Router.route('/:school/admin/users/import/teachers', {
    name: 'admin.users.import.teachers',
    layoutTemplate: 'adminLayout',
    template: 'AdminTeachersImport',
    action: function () {
        this.render('AdminTeachersImport');
    }
});

Router.route('/:school/admin/users/relationships', {
    name: 'admin.users.relationships',
    layoutTemplate: 'adminLayout',
    template: 'AdminUsersRelationships',
    action: function () {
        this.render('AdminUsersRelationships');
    }
});

Router.route('/:school/admin/lists/list', {
    name: 'admin.lists.list',
    layoutTemplate: 'adminLayout',
    template: 'AdminDistributionListsSearch',
    action: function () {
        this.render('AdminDistributionListsSearch');
    }
});

Router.route('/:school/admin/leads',{
    name: 'admin.leads.info',
    layoutTemplate: 'adminLayout',
    template: 'AdminLeads',
    action: function()
    {
        this.render('AdminLeads');
    }
});

Router.route('/:school/admin/lists/add', {
    name: 'admin.lists.add',
    layoutTemplate: 'adminLayout',
    template: 'AdminDistributionListsAdd',
    action: function () {
        this.render('AdminDistributionListsAdd');
    }
});

Router.route('/:school/admin/lists/view/:code', {
    name: 'admin.lists.view',
    layoutTemplate: 'adminLayout',
    template: 'AdminDistributionListView',
    action: function () {
        this.render('AdminDistributionListView');
    }
});

Router.route('/:school/admin/classes/list', {
    name: 'admin.classes.list',
    layoutTemplate: 'adminLayout',
    template: 'AdminClassesSearch',
    action: function () {
        this.render('AdminClassesSearch');
    }
});

Router.route('/:school/admin/classes/view/:classCode', {
    name: 'admin.classes.view',
    layoutTemplate: 'adminLayout',
    template: 'AdminClassesView',
    action: function () {
        this.render('AdminClassesView');
    }
});

Router.route('/:school/admin/classes/add', {
    name: 'admin.classes.add',
    layoutTemplate: 'adminLayout',
    template: 'AdminClassesAdd',
    action: function () {
        this.render('AdminClassesAdd');
    }
});

Router.route('/:school/admin/classes/import', {
    name: 'admin.classes.import',
    layoutTemplate: 'adminLayout',
    template: 'AdminClassesImport',
    action: function () {
        this.render('AdminClassesImport');
    }
});

Router.route('/:school/admin/newsgroups/list', {
    name: 'admin.newsgroups.list',
    layoutTemplate: 'adminLayout',
    template: 'AdminNewsgroupsSearch',
    action: function () {
        this.render('AdminNewsgroupsSearch');
    }
});

Router.route('/:school/admin/newsgroups/view/:code', {
    name: 'admin.newsgroups.view',
    layoutTemplate: 'adminLayout',
    template: 'AdminNewsgroupsView',
    action: function () {
        this.render('AdminNewsgroupsView');
    }
});

Router.route('/:school/admin/newsgroups/add', {
    name: 'admin.newsgroups.add',
    layoutTemplate: 'adminLayout',
    template: 'AdminNewsgroupsAdd',
    action: function () {
        this.render('AdminNewsgroupsAdd');
    }
});

Router.route('/:school/admin/newsgroups/import', {
    name: 'admin.newsgroups.import',
    layoutTemplate: 'adminLayout',
    template: 'AdminNewsgroupsImport',
    action: function () {
        this.render('AdminNewsgroupsImport');
    }
});

Router.route('/:school/admin/news/add', {
    name: 'admin.news.add',
    layoutTemplate: 'adminLayout',
    template: 'AdminNewsAdd',
    action: function () {
        this.render('AdminNewsAdd');
    }
});

Router.route('/:school/admin/calendar/add', {
    name: 'admin.calendar.add',
    layoutTemplate: 'adminLayout',
    template: 'AdminCalendarAdd',
    action: function () {
        this.render('AdminCalendarAdd');
    }
});

Router.route('/:school/admin/news/import', {
    name: 'admin.news.import',
    layoutTemplate: 'adminLayout',
    template: 'AdminNewsImport',
    action: function () {
        this.render('AdminNewsImport');
    }
});


Router.route('/:school/admin/news/view', {
    name: 'admin.news.search',
    layoutTemplate: 'adminLayout',
    template: 'AdminNewsSearch',
    action: function () {
        this.render('AdminNewsSearch');
    }
});



Router.route('/:school/admin/news/view/:msgcode', {
    name: 'admin.news.view',
    layoutTemplate: 'adminLayout',
    template: 'AdminNewsView',
    action: function () {
        this.render('AdminNewsView');
    }
});


Router.route('/:school/admin/absence/register', {
    name: 'admin.absence.register',
    layoutTemplate: 'adminLayout',
    template: 'AdminAbsenceRegister',
    action: function () {
        this.render('AdminAbsenceRegister');
    }
});

Router.route('/:school/admin/absence/upload', {
    name: 'admin.absence.upload',
    layoutTemplate: 'adminLayout',
    template: 'AdminUploadAttendance',
    action: function () {
        this.render('AdminUploadAttendance');
    }
});

Router.route('/:school/admin/absence/absentees', {
    name: 'admin.absence.absentees',
    layoutTemplate: 'adminLayout',
    template: 'AdminAbsentees',
    action: function () {
        this.render('AdminAbsentees');
    }
});

Router.route('/:school/admin/absence/expected', {
    name: 'admin.absence.expected',
    layoutTemplate: 'adminLayout',
    template: 'AdminAbsenceExpected',
    action: function () {
        this.render('AdminAbsenceExpected');
    }
});


Router.route('/:school/admin/rss', {
    name: 'admin.rss',
    action: function () {
        this.redirect('/' + this.params.school + '/admin/rss/list');
    }
});


Router.route('/:school/admin/rss/add', {
    name: 'admin.rss.add',
    layoutTemplate: 'adminLayout',
    template: 'AdminRssAdd',
    action: function () {
        this.render('AdminRssAdd');
    }
});

Router.route('/:school/admin/rss/list', {
    name: 'admin.rss.list',
    layoutTemplate: 'adminLayout',
    template: 'AdminRss',
    action: function () {
        this.render('AdminRss');
    }
});

Router.route('/:school/admin/school/edit', {
    name: 'admin.school.edit',
    layoutTemplate: 'adminLayout',
    template: 'EditSchool',
    action: function () {
        this.render('EditSchool');
    }
});