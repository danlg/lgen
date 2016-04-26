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
	},
	onRun: function () {
		$('body').removeClass('no-transitions');
	},
	onAfterAction: function () {
		// Disable CSS transitions on page load
	    $('body').addClass('no-transitions');
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

Router.route('/:school/admin/users/relationships', {
    name: 'admin.users.relationships',
    layoutTemplate: 'adminLayout',
    template: 'AdminUsersRelationships',
    action: function () {
        this.render('AdminUsersRelationships');
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

Router.route('/:school/admin/newsgroups/view/:classCode', {
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

Router.route('/:school/admin/news/import', {
    name: 'admin.news.import',
    layoutTemplate: 'adminLayout',
    template: 'AdminNewsImport',
    action: function () {
        this.render('AdminNewsImport');
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
    layoutTemplate: 'adminLayout',
    template: 'AdminRss',
    action: function () {
        this.render('AdminRss');
    }
});