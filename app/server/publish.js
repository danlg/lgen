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
    let classCursor = Smartix.Groups.Collection.find({
        //TODO add here the schoolname/namespace in the query
        type: 'class',
        admins: this.userId
    });
    //log.info("createdClassByMe count", classCursor.count());
    //log.info("createdClassByMe fetch", classCursor.fetch());
    return classCursor;
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
  this.unblock();
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
Meteor.publish('sounds', function (schoolName, category, id) {
    this.unblock();
    let soundCursor = Sounds.find({
        'metadata.school': schoolName,
         'metadata.category': category,
         'metadata.id': id
        //should be already quite granular with the room =class / chat room id,
        // the other criteria are unnecessary
    });
    // log.info("Published " , soundCursor.count(), " sounds with criteria: ",
    //     "metadata.school", schoolName,
    //     ", metadata.category", category,
    //     ", metadata.id", id
    // );
    return soundCursor;
});

Meteor.publish('documents',function(school, category, id){
  this.unblock();
  return Documents.find({
      'metadata.school': school,
      'metadata.category': category,
      'metadata.id': id
  });
});
