/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Schema = Schema || {};

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


Schema.profile = {
  firstname: "",
  lastname: "",
  role: "",
  dob: "",
  organization: "",
  city: "",
  lang:"",
  email: false, //default as false so user needs to opt it to receive email message notificaiton
  push: true,
  firstchat: true,
  firstinvitation: true,
  firstpicture: true,
  firstclassjoined: true,
  hybridapppromote:false,
  hasUserSeenTour:false,
  referral: 0
};
