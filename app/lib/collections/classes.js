Classes = new Mongo.Collection('classes');


ClassesSchema = new SimpleSchema({
  className: {
    type: String,
    optional: false
    //regEx: /[a-z0-9]/

  },
  classCode: {
    type: String,
    optional: false,
    unique: true,
    min: 3,
    regEx: /^[a-z0-9]+$/,
    custom: function () {
      if (Meteor.isClient && this.isSet && this.isInsert) {
       
        var inputClassCode = this.value;
   
        Meteor.call("class/classCodeIsAvailable", this.value, function (err, result) {
          
          var classCodeSuggestion = inputClassCode +""+ getRandomInt(0,99);
          var isAvailable = result;
        
          if (isAvailable == false) {
            AutoForm.getValidationContext("insertClass").resetValidation();           
            AutoForm.getValidationContext("insertClass").addInvalidKeys([{ name:  "classCode",
                                                                           type:  "notUniqueAndSuggestClasscode",
                                                                           value: classCodeSuggestion }]);      
            return "problem";
          }

        });

      }
    }

  },
  anyoneCanChat: {
    type: Boolean,
    optional: false,
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox2",
      },
    }
    // autoValue:function(){
    //   return true;
    // }
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
    // autoValue:function(){
    //   return true;
    // }
  },
  joinedUserId: {
    type: [String],
    optional: true
  },
  messagesObj: {
    type: [Object],
    optional: true,
    blackbox: true
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
  createBy: {
    type: String,
    optional: false,
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isInsert)
        return Meteor.userId();
    }

  },
  createdAt: {
    type: Date,
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    }
  }


});

ClassesSchema.i18n("schemas.ClassesSchema");
Classes.attachSchema(ClassesSchema);


if (Meteor.isServer) {
  Classes.allow({
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


ClassesSchema.messages({
  
  notUniqueAndSuggestClasscode:"[label] is not unique. You may try [value]"
});