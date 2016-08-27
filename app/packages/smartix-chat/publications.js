Meteor.publish('getChatRoomById', function (chatRoomId) {
  return Smartix.Groups.Collection.find({
    _id: chatRoomId
  });
});

Meteor.publish('getAllMyChatRooms', function () {
  // Meteor._sleepForMs(5000);
  return Smartix.Groups.Collection.find({users: this.userId, type:'chat'});
});

// Meteor.publish('getChatRoomMenbers', function () {
//   var chat = Chat.find({
//     users: {
//       $in: [this.userId]
//     }
//   }).fetch();
//   var arr = lodash.map(chat, "chatIds");
//   arr = lodash.pull(lodash.flatten(arr), this.userId);
//   return Meteor.users.find({
//     _id: {
//       $in: arr
//     }
//   });
//
// });

Meteor.publishComposite('chatRoomWithUser', function (chatRoomId) {
  return {
    find: function () {
      // Find posts made by user. Note arguments for callback function
      // being used in query.
	    var cursor = Smartix.Groups.Collection.find(chatRoomId);
        log.info("publishComposite:chatRoomWithUse", chatRoomId);
        return cursor;
    },
    children: [
      {
        // This section will be similar to that of the previous example.
        find: function (chat) {
          // Find post author. Even though we only want to return
          // one record here, we use "find" instead of "findOne"
          // since this function should return a cursor.
          return Meteor.users.find({_id: {$in: chat.users}});
        }
      }
    ]
  };
});


Meteor.publishComposite('allMyChatRoomWithUser', function () {
  return {
    find: function () {
      // Find posts made by user. Note arguments for callback function
      // being used in query.
      return Smartix.Groups.Collection.find({users: this.userId, type:'chat'});
    },
    children: [
      {
        // This section will be similar to that of the previous example.
        find: function (chat) {
          // Find post author. Even though we only want to return
          // one record here, we use "find" instead of "findOne"
          // since this function should return a cursor.
          chat.users = lodash.reject(chat.users, this.userId);
          return Meteor.users.find({_id: {$in: chat.users}});
        }
      }
    ]
  };
});