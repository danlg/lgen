/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Schema = Schema || {};

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