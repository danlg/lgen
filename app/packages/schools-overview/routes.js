Router.route('/:school/mobile/overview', {
    name: 'mobile.school.overview',
    layoutTemplate: 'AppLayout',
    template: 'MobileSchoolOverview',
    action: function () {
        this.render('MobileSchoolOverview');
    }
});