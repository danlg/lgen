Smartix = Smartix || {};

Smartix.Class = Smartix.Class || {};

Smartix.Class.AutoformSchema.joinClass = new SimpleSchema({
  classCode: {
    type: String
  }
});

Smartix.Class.AutoformSchema.joinClass.messages({
  notYourClass: "You cant join the class you own"
});


Smartix.Class.AutoformSchema.leaveClass = new SimpleSchema({
  classCode: {
    type: String
  }
});

Smartix.Class.AutoformSchema.inviteClass = new SimpleSchema({
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