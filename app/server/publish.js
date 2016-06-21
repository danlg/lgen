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
  if (id.constructor === Array){
    var images = Images.find({
      'metadata.school': school,
      'metadata.category': category,
      'metadata.id': {$in: id}
  });
  }
  else
  {
        var images = Images.find({
          'metadata.school': school,
          'metadata.category': category,
          'metadata.id': id
      });
  }
    return images;
});

/**
 * Publish sound
 * @param school
 * @param category chat or class
 * @param id chatRoomId or classCode
 */
Meteor.publish('sounds', function (school, category, id) {
  if (id.constructor === Array){
    var sounds = Sounds.find({
      'metadata.school': school,
      'metadata.category': category,
      'metadata.id': {$in: id}
  });
  }
  else
  {    
    var sounds = Sounds.find({
          'metadata.school': school,
          'metadata.category': category,
          'metadata.id': id
      });
  }
  return sounds;
});

Meteor.publish('documents',function(school, category, id){
  if(id.constructor === Array)
  { 
    var documents = Documents.find({
        'metadata.school': school,
        'metadata.category': category,
        'metadata.id': {$in: id}
    });
  }
  else
  {    
    var documents = Documents.find({
      'metadata.school': school,
      'metadata.category': category,
      'metadata.id': id
    });
  }
  return documents;
});
