Class = new Mongo.Collection('class');


Class.attachSchema(new SimpleSchema({
  className: {
    type: String,
    label: "Class name",
  },
  classCode: {
    type: String,
    label: "Class code",
  },
  AnyoneCanChat: {
    type: Boolean,
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox2",
      },
    }
  },
  HigherThirteen: {
    type: Boolean,
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox2",
      },
    }
  }



}));


if (Meteor.isServer) {
  Class.allow({
    insert: function (userId, doc) {
      console.log("asd");
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
