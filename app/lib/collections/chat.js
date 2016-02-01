Chat = new Mongo.Collection('chat');

Chat.attachSchema(new SimpleSchema({
  chatIds: {
    type: [String],
    // blackbox:true
  },
  messagesObj: {
    type: [Object],
    blackbox: true
  },
  chatRoomName:{
    type: String,
    optional: true
  },
  chatRoomAvatar:{
    type: String, 
    optional: true
  },
  chatRoomModerator:{
      type:String,
      optional:true
  }
}));

if (Meteor.isServer) {
  Chat.allow({
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