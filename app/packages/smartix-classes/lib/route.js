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
  path: "/class/:classCode/detail",
    waitOn: function(){
      return[
        Meteor.subscribe('smartix:classes/associatedClasses'),
        Meteor.subscribe('smartix:classes/allUsersWhoHaveJoinedYourClasses'),
        Meteor.subscribe('smartix:classes/otherClassmates', this.params.classCode)               
      ]
    } 
});

Router.route('classEdit', {
  path: "/class/:classCode/edit",
  waitOn: function () {
    return Meteor.subscribe('smartix:classes/classByClassCode', this.params.classCode);
  }
});

Router.route('ClassUsers', {
  path: "/class/:classCode/users",
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
    path: "/class/:classCode/panel"
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