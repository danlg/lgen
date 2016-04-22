Router.route('/:school/home', {
    name: 'mobile.school.home',
    layoutTemplate: 'AppLayout',
    template: 'MobileSchoolHome',
    action: function () {
        this.render('MobileSchoolHome');
    }
});