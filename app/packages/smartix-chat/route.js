Router.route('Chatoption', {
  path: "/chat/option",
  waitOn: function () {
    Meteor.subscribe('createdClassByMe');
  }
});

Router.route('ChatRoom', {
  path: "/chat/:chatRoomId",
  waitOn: function () {
    return [
      Meteor.subscribe('images'),
      Meteor.subscribe('sounds'),
      Meteor.subscribe('documents'),
      Meteor.subscribe('chatRoomWithUser', this.params.chatRoomId)
    ];
  }
});

Router.route('ChatRoomInformation', {
  path: "/chat/:chatRoomId/info",
  waitOn: function () {
    return [
      Meteor.subscribe('chatRoomWithUser', this.params.chatRoomId)
    ];
  }
});



Router.route('ChatInvite', {
  path: "/chat-invite",
  waitOn: function () {
    return [
      Meteor.subscribe('getAllJoinedClassesUser'),
      Meteor.subscribe('getAllJoinedClassesCreateBy')
    ];
  }
});

Router.route('GroupChatInvite', {
    path: "/group-chat-invite",
    waitOn: function(){
        return [
            Meteor.subscribe('createdClassByMe')
        ]
    }
});

Router.route('GroupChatInviteChooser', {
    path: "/group-chat-invite/class/:classCode",
    waitOn: function(){
        return [
            Meteor.subscribe('createdClassByMe'),
            Meteor.subscribe('getAllJoinedClassesUser'),
            Meteor.subscribe('getAllMyChatRooms')
        ]
    }
});

