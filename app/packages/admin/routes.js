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
})