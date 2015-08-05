Classes = new Mongo.Collection('classes');


Classes.attachSchema(new SimpleSchema({
  className: {
    type: String,
    label: "Class name",
    optional: false,
    regEx: /[a-z0-9]/

  },
  classCode: {
    type: String,
    label: "Class code",
    optional: true,
    unique: true
  },
  AnyoneCanChat: {
    type: Boolean,
    optional: false,
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox2",
      },
    }
  },
  HigherThirteen: {
    type: Boolean,
    optional: false,
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox2",
      },
    }
  }



}));


if (Meteor.isServer) {
  Classes.allow({
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
