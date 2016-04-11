Router.route('/class/:classCode/info', {
    name: 'ClassInformation',
    template: 'ClassInformation',
    path: "/class/:classCode/info",
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


Router.route('classDetail', {
  path: "/class/:classCode/detail"
});

Router.route('classEdit', {
  path: "/class/:classCode/edit",
  waitOn: function () {
    return Meteor.subscribe('smartix:classes/classByClassCode', this.params.classCode);
  }
});

Router.route('ClassUsers', {
  path: "/class/:classCode/users",
  waitOn: function () {
    return [
        Meteor.subscribe('smartix:classes/classByClassCode', this.params.classCode),
        Meteor.subscribe('smartix:classes/allUsersWhoHaveJoinedYourClasses')
    ];
  }
});

Router.route('ClassInvitation', {
  path: "/class/:classCode/invite",
  waitOn: function () {
    return [
      Meteor.subscribe('smartix:classes/classByClassCode', this.params.classCode)
    ];
  }
});

Router.route('ClassPanel',{
    path: "/class/:classCode/panel",   
    
});

Router.route('AddClass', {
  path: "/class/add"
});

Router.route('JoinClass', {
  path: "/class/join",
  waitOn: function () {
    Meteor.subscribe('joinedClass');
  }
});