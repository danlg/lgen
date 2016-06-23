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

/**
 * Publish images
 * @param school
 * @param category 'chat', 'class' or 'news'
 * @param id chatRoomId or classCode
 */
Meteor.publish('images', function (school, category, id) {
  //roomId can be a classCode or chatRoomId
  return images = Images.find({
      'metadata.school': school,
      'metadata.category': category,
      'metadata.id': id
  });
});

/**
 * Publish sound
 * @param school
 * @param category chat or class
 * @param id chatRoomId or classCode
 */
Meteor.publish('sounds', function (school, category, id) {
    return Sounds.find({
      'metadata.school': school,
      'metadata.category': category,
      'metadata.id': id
  });
});

Meteor.publish('documents',function(school, category, id){
  return Documents.find({
      'metadata.school': school,
      'metadata.category': category,
      'metadata.id': id
  });
});
