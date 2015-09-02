Chat = new Mongo.Collection('chat');

Chat.attachSchema(new SimpleSchema({
  chatIds: {
    type: [String],
    // blackbox:true
  },
  messagesObj:{
    type: [Object],
    blackbox:true
  }
  // 'messagesObj.$.from':{
  //   type: Object,
  //   blackbox:true
  // },
  // 'messagesObj.$.sendAt':{
  //   type: Date,
  //   autoValue:function(){
  //     return new Date;
  //   }
  // },
  // 'messagesObj.$.text':{
  //   type: String
  // }
  //
}));


if (Meteor.isServer) {
  Chat.allow({
    insert: function (userId, doc) {
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
