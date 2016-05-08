Router.route('/edit-school', {
    name: 'school.add',
    layoutTemplate: 'AppLayout',
    template: 'AddSchool',
    action: function () {
        this.render('AddSchool');
    }
});

