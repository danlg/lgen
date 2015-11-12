/**
 * Meteor.publish('items', function (param1, param2) {
 *  this.ready();
 * });
 */



Meteor.publish('class', function (classCode) {
  return Classes.find({
    classCode: classCode
  });
});
Meteor.publish('getClassByClassId', function (classId) {
  return Classes.find(classId);
});

Meteor.publish('getCommentsByClassIdNId', function (classId, _id) {
  return Commend.find({"userId": _id, "classId": classId});
});

Meteor.publish('getClassMsgId', function (msgId) {
  return Classes.find({
    messagesObj: {
      $elemMatch: {
        msgId: msgId
      }
    }
  });
});
Meteor.publish('personCreateClass', function (classCode) {
  var ownId = _.pick(Classes.findOne({
    classCode: classCode
  }), 'createBy');
  return Meteor.users.find({
    _id: ownId.createBy
  });
});


Meteor.publish('joinedClass', function () {
  return Classes.find({
    joinedUserId: this.userId
  });
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

//get all users that have joined current teacher's classes
Meteor.publish('getAllJoinedClassesUser', function () {
  log.info("getAllJoinedClassesUser");

  var classes = Classes.find({
    createBy: this.userId //find the classes create by teacher using teacher's userid
  }).fetch(); //fetch is used to extract the result to an array.
  
  var arr = lodash.map(classes, 'joinedUserId'); //extract only the joinedUserId fields to another array

  arr = lodash.pull(lodash.flatten(arr), this.userId); //flatten the array from 2D to 1D array for easy use
  
 
  
  return Meteor.users.find({
    _id: {
      $in: arr
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


Meteor.publish('getJoinedClassUser', function (classCode) {
  var classObj = Classes.findOne({
    classCode: classCode
  });
  var joinedUserId = classObj.joinedUserId;
  return Meteor.users.find({
    _id: {
      $in: joinedUserId
    }
  });
});

Meteor.publish("images", function () {
  return Images.find();
});
Meteor.publish("sounds", function () {
  return Sounds.find();
});


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


Meteor.publishComposite('getClassroomWithJoinedUserByClassCode', function (classCode) {
  return {
    find: function () {
      // Find posts made by user. Note arguments for callback function
      // being used in query.
      return Classes.find({classCode: classCode});
    },
    children: [
      {
        // This section will be similar to that of the previous example.
        find: function (classObj) {
          // Find post author. Even though we only want to return
          // one record here, we use "find" instead of "findOne"
          // since this function should return a cursor.
          // chat.chatIds  = lodash.reject(chat.chatIds,this.userId);

          return Meteor.users.find({_id: {$in: classObj.joinedUserId}});
        }
      }
    ]
  };
});
