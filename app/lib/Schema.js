Schema = {};
Schema.joinClass = new SimpleSchema({
  classCode: {
    type: String
  }
});

Schema.emailSignup = new SimpleSchema({
  firstname:{
    type:String
  },
  lastname:{
    type:String
  },
  email:{
    type:String,
    regEx:SimpleSchema.RegEx.Email,
  },
  password:{
    type:String,
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
  role:{
    type:String
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
        selectizeOptions: {"asd":123}
      }
    }
  }
});
