/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

Meteor.publish('notifications', function (schoolId) {
    return Notifications.find({
      userId: this.userId,
      namespace: schoolId,
      hasRead: false
      //TODO add here the event Type for a finer granularity
    });
});

//db.getCollection('notifications').distinct("eventType")
// [
//     "newchatmessage",
//     "newclassmessage",
//     "newclasscomment",
//     "newnewsgroupmessage",
//     "attendance"
// ]