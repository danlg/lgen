Router.route('EmailInvite', {
  path: "/class/:classCode/invite-email",
  waitOn: function () {
    return Meteor.subscribe('class', this.params.classCode);
  }
});

Router.route('ShareInvite', {
  path: "/class/:classCode/invite/share",
  waitOn: function () {
    return [
      Meteor.subscribe('class', this.params.classCode)
    ];
  }
});

Router.route('join/', {
  name: 'ClassSearchInformationForWebUser'
});

Router.route('join/:classCode?', {
  name: 'ClassInformationForWebUser',
  waitOn: function () {   
    return [
      Meteor.subscribe('personCreateClass', this.params.classCode),
      Meteor.subscribe('getClassByClassCode', this.params.classCode)
    ];
  }
});