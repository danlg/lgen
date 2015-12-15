/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Schema = {};


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

Schema.emailSignup = new SimpleSchema({
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  password: {
    type: String,
    min: 4,
  },
  confirmPassword: {
    type: String,
    label: "Enter the password again",
    min: 4,
    custom: function () {
      if (this.value !== this.field('password').value) {
        return "passwordMismatch";
      }
    }
  },
  role: {
    type: String
  },
  dob: {
    type: String,
    optional: true
  }
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


Schema.chatSetting = new SimpleSchema({
  workHour: {
    type: Boolean,
    optional: true,
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox2",
      },
    }
  },
  workHourTime: {
    type: Object,
    optional: true,
  },
  'workHourTime.from': {
    type: String,
    optional: true,
  },
  'workHourTime.to': {
    type: String,
    optional: true,
  },
  
  //define an array of boolean
  //https://github.com/aldeed/meteor-simple-schema/issues/277
  'workHourTime.weeks': {
    type: Array,
    optional: true,
    minCount: 7
  },
 'workHourTime.weeks.$':{
   type:Boolean
 } ,
  allowChat: {
    type: [String],
    optional: true,
  }
});

Schema.editprofile = new SimpleSchema({
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  location: {
    type: String,
    optional: true
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  useravatar:{
    type: String,
    optional:true
  }
});


Schema.profile = {
  firstname: "",
  lastname: "",
  role: "",
  dob: "",
  email: false, //default as false so user needs to opt it to receive email message notificaiton
  push: true,
  firstchat: true,
  firstinvitation: true,
  firstpicture: true,
  firstclassjoined: true,
  hybridapppromote:false,
  referral: 0,
};
