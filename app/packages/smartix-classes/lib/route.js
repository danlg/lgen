Router.route('/class/info/:classCode', {
    name: 'ClassInformation',
    template: 'ClassInformation',
    path: "/class/info/:classCode",
    action: function () {
        this.render();
    },
    waitOn: function () {
        return [
            Meteor.subscribe('smartix:classes/adminsOfClass', this.params.classCode),
            Meteor.subscribe('smartix:classes/classByClassCode', this.params.classCode)
        ];
    }
});


Router.route('ClassJoined', {
  path: "/class/joined/:classCode"
});

Router.route('classEdit', {
  path: "/class/edit/:classCode",
  waitOn: function () {
    return Meteor.subscribe('smartix:classes/classByClassCode', this.params.classCode);
  }
});

Router.route('ClassUsers', {
  path: "/class/users/:classCode"
});

Router.route('ClassInvitation', {
  path: "/class/invite/:classCode",
  waitOn: function () {
    return [
      Meteor.subscribe('smartix:classes/classByClassCode', this.params.classCode)
    ];
  }
});

Router.route('ClassPanel',{
    path: "/class/:classCode"
});

Router.route('AddClass', {
  path: ":school/class/add"
});

Router.route('JoinClass', {
  path: ":school/class/join",
  waitOn: function () {
    Meteor.subscribe('joinedClass');
  }
});