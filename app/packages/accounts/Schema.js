/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Schema = Schema || {};

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