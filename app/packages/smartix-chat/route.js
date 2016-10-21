Router.route('Chatoption', {
  path: "/chat/option"
});

Router.route('ChatRoom', {
  path: "/chat/:chatRoomId"
});

Router.route('ChatRoomInformation', {
  path: "/chat/:chatRoomId/info"
});


//use user list from sub globalUsersBasicInfo
Router.route('ChatInvite', {
  path: "/:school/chat-invite"
});

Router.route('GroupChatInvite', {
    path: "/:school/group-chat-invite"
});

Router.route('GroupChatInviteChooser', {
    path: "/:school/group-chat-invite/class/:classCode",
});

