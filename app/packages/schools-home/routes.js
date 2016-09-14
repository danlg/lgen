// Router.route('/:school/home', {
//     name: 'mobile.school.home',
//     layoutTemplate: 'AppLayout',
//     template: 'MobileSchoolHome',
//     action: function () {
//         this.render('MobileSchoolHome');
//     }
// });

Router.route('/:school/contact', {
    name: 'mobile.school.contact',
    layoutTemplate: 'AppLayout',
    template: 'MobileSchoolContact',
    action: function () {
        this.render('MobileSchoolContact');
    }
});