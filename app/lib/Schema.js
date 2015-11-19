Schema = {};


Schema.joinClass = new SimpleSchema({
  classCode: {
    type: String,
    custom:function(){
      
      if (Meteor.isClient && this.isSet){
        
         Meteor.call("class/searchExact", this.value, function (err, result) {
          
          var isMyClass = result;
        
          if (isMyClass) {
            AutoForm.getValidationContext("joinClassForm").resetValidation();           
            AutoForm.getValidationContext("joinClassForm").addInvalidKeys([{ name:  "classCode",type:  "notYourClass" }]);      
          }

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
    min: 8,
  },
  confirmPassword: {
    type: String,
    label: "Enter the password again",
    min: 8,
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
  //workHourTime.weeks is actually work days
  'workHourTime.weeks': {
    type: [String],
    optional: true,
  },
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
  }
});


Schema.profile = {
  firstname: "",
  lastname: "",
  role: "",
  dob: "",
  email: true,
  push: true,
  firstchat: true,
  firstinvitation: true,
  firstpicture: true,
  firstclassjoined: true,
  referral: 0
};
