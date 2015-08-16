/**
 * Meteor.publish('items', function (param1, param2) {
 *  this.ready();
 * });
 */



Meteor.publish('class', function (classCode) {
  return Classes.find({classCode:classCode});
});
Meteor.publish('personCreateClass', function (classCode) {
  var ownId = _.pick(Classes.findOne({classCode:classCode}),'createBy');
  return Meteor.users.find({_id:ownId.createBy});
});


Meteor.publish('joinedClass', function () {
  return Classes.find({joinedUserId:this.userId});
});
Meteor.publish('getUserById', function (userId) {
  return Meteor.users.find({_id:userId});
});
Meteor.publish('getJoinedClassByUserId', function (userId) {
  return Classes.find({joinedUserId:userId});
});

Meteor.publish('createdClassByMe', function () {
  return Classes.find({createBy:this.userId});
});

Meteor.publish('getChatRoomById', function (chatRoomId) {
  return Chat.find({_id:chatRoomId});
});

Meteor.publish('user', function (_id) {
  return Meteor.users.find({_id:_id});
});

Meteor.publish('getAllMyChatRooms', function () {
  return Chat.find({chatIds:{$in:[this.userId]}});
});

Meteor.publish('getAllJoinedClassesUser', function () {
  var classes = Classes.find({joinedUserId:this.userId}).fetch();
  var arr = lodash.map(classes,'createBy');
  arr = lodash.pull(lodash.flatten(arr),this.userId);
  return Meteor.users.find({_id:{$in:arr}});
});



Meteor.publish('getChatRoomMenbers', function () {
  var chat  =Chat.find({chatIds:{$in:[this.userId]}}).fetch();
  var arr  = lodash.map(chat,"chatIds");
  arr = lodash.pull(lodash.flatten(arr),this.userId);
  return Meteor.users.find({_id:{$in:arr}});

});



Meteor.publish('getJoinedClassUser', function (classCode) {
    var classObj =  Classes.findOne({classCode:classCode});
    var joinedUserId = classObj.joinedUserId;
  return Meteor.users.find({_id:{$in:joinedUserId}});
});
