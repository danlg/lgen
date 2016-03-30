/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Schema = Schema || {};

Schema.joinClass = new SimpleSchema({
  classCode: {
    type: String,
    custom:function(){
      if (Meteor.isClient && this.isSet){
         Meteor.call("class/searchExact", this.value, function (err, result) {
          // validation cannot join your own class done on the server side
          // var isMyClass = result;
          //if (isMyClass) {
          //  AutoForm.getValidationContext("joinClassForm").resetValidation();
          //  AutoForm.getValidationContext("joinClassForm").addInvalidKeys([{ name:  "classCode",type:  "notYourClass" }]);
          //}
        });       
      }
    }
  }
});

Schema.joinClass.messages({
  notYourClass: "You cant join the class you own"
});


Schema.leaveClass = new SimpleSchema({
  classCode: {
    type: String
  }
});

Schema.inviteClass = new SimpleSchema({
  emailOrName: {
    type: String
  },
  classCode: {
    type: String,
    autoform: {
      afFieldInput: {
        type: "hidden"
      }
    }
  }
});


Schema.sendMsg = new SimpleSchema({
  sendTarget: {
    type: [String],
    autoform: {
      type: "selectize",
      afFieldInput: {
        multiple: true,
        selectizeOptions: {"asd": 123}
      }
    }
  }
});


