/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

Meteor.publish('notifications', function () {
  //log.info("publish:notificaitons:"+ this.userId);
  return Notifications.find({
    userId: this.userId
  });
});