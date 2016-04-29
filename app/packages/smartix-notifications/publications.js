/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

Meteor.publish('notifications', function () {
    return Notifications.find({
      userId: this.userId,
      hasRead: false
    });    
});