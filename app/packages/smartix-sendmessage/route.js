Router.route('SendMessage', {
  path: "/message/send/:classCode?",
  waitOn: function () {
    return [
      Meteor.subscribe('createdClassByMe'),
      Meteor.subscribe('images', this.params.classCode),
      Meteor.subscribe('documents', this.params.classCode),
      Meteor.subscribe('sounds')
    ];
  }
});

Router.route('MessageClassSelection', {
  path: "/message/classselect",
  waitOn: function () {
    return Meteor.subscribe('createdClassByMe');
  }
});