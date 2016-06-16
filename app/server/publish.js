/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/**
 * Meteor.publish('items', function (param1, param2) {
 *  this.ready();
 * });
 */

Meteor.publish('getCommentsByClassIdNId', function (classId, _id) {
  return Commend.find({"userId": _id, "classId": classId});
});

Meteor.publish('getUserById', function (userId) {
  return Meteor.users.find({
    _id: userId
  });
});

Meteor.publish('getJoinedClassByUserId', function (userId) {
  return Smartix.Groups.Collection.find({
      type: 'class',
    users: userId
  });
});

Meteor.publish('getJoinedClassCreatedByMeByUserId', function (userId) {
  return Smartix.Groups.Collection.find({
      type: 'class',
    users: userId,
    admins: this.userId
  });
});

Meteor.publish('createdClassByMe', function () {
  return Smartix.Groups.Collection.find({
      type: 'class',
    admins: this.userId
  });
});

Meteor.publish('user', function (_id) {
  return Meteor.users.find({
    _id: _id
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
