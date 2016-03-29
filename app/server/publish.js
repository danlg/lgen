/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/**
 * Meteor.publish('items', function (param1, param2) {
 *  this.ready();
 * });
 */

Meteor.publish('notifications', function () {
  //log.info("publish:notificaitons:"+ this.userId);
  return Notifications.find({
    userId: this.userId
  });
});



Meteor.publish('getCommentsByClassIdNId', function (classId, _id) {
  return Commend.find({"userId": _id, "classId": classId});
});


Meteor.publish('getUserById', function (userId) {
  return Meteor.users.find({
    _id: userId
  });
});
Meteor.publish('getJoinedClassByUserId', function (userId) {
  return Classes.find({
    joinedUserId: userId
  });
});
Meteor.publish('getJoinedClassCreatedByMeByUserId', function (userId) {
  return Classes.find({
    joinedUserId: userId,
    createBy: this.userId
  });
});

Meteor.publish('createdClassByMe', function () {
  return Classes.find({
    createBy: this.userId
  });
});

Meteor.publish('getChatRoomById', function (chatRoomId) {
  return Chat.find({
    _id: chatRoomId
  });
});


Meteor.publish('user', function (_id) {
  return Meteor.users.find({
    _id: _id
  });
});

Meteor.publish('getAllMyChatRooms', function () {
  // Meteor._sleepForMs(5000);
  return Chat.find({
    chatIds: {
      $elemMatch: {
        _id: this.userId
      }
    }
  });
});






Meteor.publish('getChatRoomMenbers', function () {
  var chat = Chat.find({
    chatIds: {
      $in: [this.userId]
    }
  }).fetch();
  var arr = lodash.map(chat, "chatIds");
  arr = lodash.pull(lodash.flatten(arr), this.userId);
  return Meteor.users.find({
    _id: {
      $in: arr
    }
  });

});




Meteor.publish("images", function () {
  return Images.find();
});
Meteor.publish("sounds", function () {
  return Sounds.find();
});
Meteor.publish("documents",function(){
  return Documents.find();
})

Meteor.publishComposite('chatRoomWithUser', function (chatRoomId) {
  return {
    find: function () {
      // Find posts made by user. Note arguments for callback function
      // being used in query.
      return Chat.find(chatRoomId);
    },
    children: [
      {
        // This section will be similar to that of the previous example.
        find: function (chat) {
          // Find post author. Even though we only want to return
          // one record here, we use "find" instead of "findOne"
          // since this function should return a cursor.
          return Meteor.users.find({_id: {$in: chat.chatIds}});
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
      return Chat.find({chatIds: this.userId});
    },
    children: [
      {
        // This section will be similar to that of the previous example.
        find: function (chat) {
          // Find post author. Even though we only want to return
          // one record here, we use "find" instead of "findOne"
          // since this function should return a cursor.
          chat.chatIds = lodash.reject(chat.chatIds, this.userId);
          return Meteor.users.find({_id: {$in: chat.chatIds}});
        }
      }
    ]
  };
});

