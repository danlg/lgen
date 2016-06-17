Router.route('SendMessage', {
  path: "/message/send/:classCode?",
});

Router.route('MessageClassSelection', {
  path: "/message/classselect",
  waitOn: function () {
    return Meteor.subscribe('createdClassByMe');
  }
});