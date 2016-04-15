Router.route('/admin', {
	action: function () {
		this.redirect('/admin/dashboard');
	}
});

Router.route('/admin/dashboard', {
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

Router.route('/admin/users/add', {
    name: 'admin.users.add',
    layoutTemplate: 'adminLayout',
    template: 'AdminUsersAdd',
    action: function () {
        this.render('AdminUsersAdd');
    }
});

Router.route('/admin/users/import', {
    name: 'admin.users.import',
    layoutTemplate: 'adminLayout',
    template: 'AdminUsersImport',
    action: function () {
        this.render('AdminUsersImport');
    }
});

Router.route('/admin/users/relationships', {
    name: 'admin.users.relationships',
    layoutTemplate: 'adminLayout',
    template: 'AdminUsersRelationships',
    action: function () {
        this.render('AdminUsersRelationships');
    }
});

Router.route('/admin/classes/add', {
    name: 'admin.classes.add',
    layoutTemplate: 'adminLayout',
    template: 'AdminClassesAdd',
    action: function () {
        this.render('AdminClassesAdd');
    }
});

Router.route('/admin/classes/import', {
    name: 'admin.classes.import',
    layoutTemplate: 'adminLayout',
    template: 'AdminClassesImport',
    action: function () {
        this.render('AdminClassesImport');
    }
});

Router.route('/admin/news/add', {
    name: 'admin.news.add',
    layoutTemplate: 'adminLayout',
    template: 'AdminNewsAdd',
    action: function () {
        this.render('AdminNewsAdd');
    }
});

Router.route('/admin/news/import', {
    name: 'admin.news.import',
    layoutTemplate: 'adminLayout',
    template: 'AdminNewsImport',
    action: function () {
        this.render('AdminNewsImport');
    }
});

Router.route('/admin/absence/absentees', {
    name: 'admin.absence.absentees',
    layoutTemplate: 'adminLayout',
    template: 'AdminAbsentees',
    action: function () {
        this.render('AdminAbsentees');
    }
});

Router.route('/admin/absence/expected', {
    name: 'admin.absence.expected',
    layoutTemplate: 'adminLayout',
    template: 'AdminAbsenceExpected',
    action: function () {
        this.render('AdminAbsenceExpected');
    }
});

Router.route('/admin/rss', {
    name: 'admin.rss',
    layoutTemplate: 'adminLayout',
    template: 'AdminRss',
    action: function () {
        this.render('AdminRss');
    }
});