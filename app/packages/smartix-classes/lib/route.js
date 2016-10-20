Router.route('/class/info/:classCode', {
    name: 'ClassInformation',
    template: 'ClassInformation',
    path: "/class/info/:classCode",
    action: function () {
        this.render();
    }
});


Router.route('ClassJoined', {
  path: "/class/joined/:classCode"
});

Router.route('classEdit', {
  path: "/class/edit/:classCode"
});

Router.route('ClassUsers', {
  path: "/class/users/:classCode"
});

Router.route('ClassInvitation', {
  path: "/class/invite/:classCode"
});

Router.route('ClassPanel',{
    path: "/class/:classCode"
});

Router.route('AddClass', {
  path: ":school/class/add"
});

Router.route('JoinClass', {
  path: ":school/class/join"
});