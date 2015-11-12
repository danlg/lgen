Chat = new Mongo.Collection('chat');

Chat.attachSchema(new SimpleSchema({
  chatIds: {
    type: [String],
    // blackbox:true
  },
  messagesObj: {
    type: [Object],
    blackbox: true
  }
}));

if (Meteor.isServer) {
  Chat.allow({
    insert: function (userId, doc) {
      var isOwner = doc && (doc.userId === userId);
      return isOwner;
    },

    update: function (userId, doc, fieldNames, modifier) {
      var isOwner = doc && (doc.userId === userId);
      return isOwner;
    },

    remove: function (userId, doc) {
      var isOwner = doc && (doc.userId === userId);
      return isOwner;
    }
  });
}