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
  anyoneCanChat: {
    type: Boolean,
    optional: false,
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox2",
      },
    }
  },
  higherThirteen: {
    type: Boolean,
    optional: false,
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox2",
      },
    }
  },
  canBeSearch: {
    type: Boolean,
    optional: true,
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox2",
      },
    },
    autoValue:function(){
      return true;
    }
  },
  joinedUserId:{
    type:[String],
    optional:true
  },
  messagesObj:{
    type:[Object],
    optional:true,
    blackbox:true
  },
  /*"messagesObj.$.msgId":{
    type:String
  },
  "messagesObj.$.sentAt":{
    type:Date,
    autoValue: function() {
        return new Date;
    }
  },*/
  /*"messagesObj.$.content":{
    type:String
  },
  "messagesObj.$.like":{
    type:[String]
  },
  "messagesObj.$.dislike":{
    type:[String]
  },*/
  /*"messagesObj.$.msgRating":{
    type:[Object]
  },
  "messagesObj.$.msgRating.$.type":{
    type:String
  },*/
  createBy:{
    type:String,
    optional:false,
    autoform:{
      omit:true
    },
    autoValue:function(){
      if(this.isInsert)
        return Meteor.userId();
    }

  },
  createdAt:{
    type:Date,
    autoform:{
      omit:true
    },
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
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
