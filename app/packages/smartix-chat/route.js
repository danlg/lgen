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
      Meteor.subscribe('images', this.params.chatRoomId, 'chat'),
      Meteor.subscribe('documents', this.params.chatRoomId),
      Meteor.subscribe('sounds'),
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


//use user list from sub globalUsersBasicInfo
Router.route('ChatInvite', {
  path: "/:school/chat-invite",
});

Router.route('GroupChatInvite', {
    path: "/:school/group-chat-invite",
    waitOn: function(){
        return [
            Meteor.subscribe('createdClassByMe')
        ]
    }
});

Router.route('GroupChatInviteChooser', {
    path: "/:school/group-chat-invite/class/:classCode",
});

