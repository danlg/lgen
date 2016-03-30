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


Schema.chatSetting = new SimpleSchema({
  workHour: {
    type: Boolean,
    optional: true,
    autoform: {
      afFieldInput: {
        type: "boolean-checkbox2"
      }
    }
  },
  workHourTime: {
    type: Object,
    optional: true
  },
  'workHourTime.from': {
    //label: TAPi18n.__("From"),
    //todo localize this Direct method call. TAPi18n doesn;t Tap roll back French localization
    //label: "From",
    type: String,
    optional: true
  },
  'workHourTime.to': {
    //label: "To",
    type: String,
    optional: true
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
    optional: true
  }
});

Schema.editprofile = new SimpleSchema({
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  organization: { type: String, optional:true },
  city:         { type: String, optional:true },
  country:{type:String,optional:true},
  //location not used ?
  //location:     { type: String, optional: true },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
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
