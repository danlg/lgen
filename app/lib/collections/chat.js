Chat = new Mongo.Collection('chat');

Chat.attachSchema(new SimpleSchema({
  chatIds: {
    type: [String],
  },
  messagesObj:{
    type: [Object],
  },
  'messagesObj.$.from':{
    type: String
  },
  'messagesObj.$.sendAt':{
    type: Date,
    autoValue:function(){
      return new Date;
    }
  },
  'messagesObj.$.text':{
    type: String
  }

}));


if (Meteor.isServer) {
  Chat.allow({
    insert: function (userId, doc) {
      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return false;
    },

    remove: function (userId, doc) {
      return false;
    }
  });
}
