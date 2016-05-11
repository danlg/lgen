Notifications = new Mongo.Collection('notifications');


if (Meteor.isServer) {
  Notifications.allow({
    insert: function (userId, doc) {
      //var isOwner = doc && (doc.userId === userId);
      //return isOwner;
      // isOwner model doesn't work
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}