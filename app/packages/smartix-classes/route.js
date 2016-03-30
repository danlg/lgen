Router.route('ClassInformation', {
  path: "/class/:classCode/info",
  waitOn: function () {
    return [
      Meteor.subscribe('personCreateClass', this.params.classCode),
      Meteor.subscribe('class', this.params.classCode)
    ];
  }
});


Router.route('classDetail', {
  path: "/class/:classCode/detail"
});

Router.route('classEdit', {
  path: "/class/:classCode/edit",
  waitOn: function () {
    return Meteor.subscribe('class', this.params.classCode);
  }
});

Router.route('ClassUsers', {
  path: "/class/:classCode/users",
  waitOn: function () {
    return [Meteor.subscribe('class', this.params.classCode),
            Meteor.subscribe('getJoinedClassUser', this.params.classCode)
    ];
  }
});

Router.route('ClassInvitation', {
  path: "/class/:classCode/invite",
  waitOn: function () {
    return [
      Meteor.subscribe('class', this.params.classCode)
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