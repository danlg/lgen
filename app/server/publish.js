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
  var targetClass = Classes.findOne({classCode: classCode});
  
  if(targetClass){
    var ownId = _.pick(targetClass, 'createBy');
    return Meteor.users.find({
      _id: ownId.createBy
    });
  }else{
    //http://stackoverflow.com/questions/25709362/stuck-on-loading-template
    //this.ready() indicates nothing return; you cannot use return "" or return null in such case
    this.ready();
  }
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
  //find the classes create by teacher using teacher's userid
  var classes = Classes.find({
    createBy: this.userId 
  }).fetch(); //fetch is used to extract the result to an array.
  
  //extract only the joinedUserId fields to another array  
  var arr = lodash.map(classes, 'joinedUserId'); 

  //flatten the array from 2D to 1D array for easy use
  arr = lodash.pull(lodash.flatten(arr), this.userId); 
  
  //in the above arr, it contains a list of userid who have joined the class, so we use this list
  //to search the users' info in Meteor.users
  return Meteor.users.find({
    _id: {
      $in: arr
    }
  });
});

//get all the users who have created my joined classes'
Meteor.publish('getAllJoinedClassesCreateBy', function () {

  //if user is a student and is below 13, set isStudentBelow13 as true
  var currentUser = Meteor.users.findOne(this.userId);
  var isStudentBelow13 = false;
  if(currentUser.profile.role == "Student"){
    var dob = currentUser.profile.dob;
    var age = moment().diff(dob,'years');
    if(age < 13){
      isStudentBelow13 = true;
      log.info("isStudentBelow13:true:dob:"+dob+":age:"+age);
    }
  }
  
  //find the classes I have joined by my userid
  //and the class creator allows anyone in this class to start a chat    
  var myJoinedClasses;
  if(isStudentBelow13){
    myJoinedClasses = Classes.find({
      joinedUserId: this.userId,
      anyoneCanChat: true,
      higherThirteen: false //since the current user is younger than 13, 
                            //the classes with higherThirteen as true would not be searched
    }).fetch();;       
  }else{
    myJoinedClasses = Classes.find({
      joinedUserId: this.userId,
      anyoneCanChat: true
    }).fetch();;    
  }
    
  // extra the createBy fields to another array
  var arr = lodash.map(myJoinedClasses, 'createBy'); 
  
  //in the above arr, it contains a list of userid who have created the class, so we use this list
  //to search the users' info in Meteor.users
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

/*
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
*/