/**
 * The global namespace/collection for Schools.
 * @namespace Schools
 */
SmartixSchoolsCol = new Mongo.Collection('schools');

SchoolsSchema = new SimpleSchema({
   fullname:{ type:String //the long name
      , optional:true
   }
   , shortname:{  //the name in the URL
      type:String,
      optional:true //to make it possible to create a school at step 1 of trial
   }
   , logo:{ type:String, optional : true
   }
   ,backgroundImage:{type : String, optional:true}
   ,tel:{ type:String, optional : true}
   //URL
   , web:{ type:String, optional : true }
   //adminemail
   , email:{ type:String, regEx:SimpleSchema.RegEx.Email}
   //contactemail
   , contactemail:{ type:String, regEx:SimpleSchema.RegEx.Email, optional : true}
   , active:{
     type:Boolean,
     defaultValue: true
   }
   , preferences:{ type: Object
      , blackbox: true
   }
   , country: {type:String, optional:true}
   , address1: {type:String, optional:true}
   , address2: {type:String, optional:true}
   , postalCode: {type:String, optional:true}
   , city: {type:String, optional:true}
   , preferredLanguage: {type:String, optional:true}

   //plan fields
   , planStartDate: { type:String, optional:true
   }
   , planChosen: { type:String, optional:true //links to plan.planName
   }
   , planTrialExpiryDate:{ type:Date, optional:true
   }
   , planExpiryDate:{ type:Date, optional:true
   }
   ,planUnitsBought: {
     type:Number, optional: true
   }
   , planSubscriptionId: {
     type:String, optional:true
   }


   //cumulates the revenues from this school help to estimate LTV
   , revenueToDate: { type:Number //stored in chargebee ?
      , defaultValue:0
   }
   , revenueToDateCcy: { type:String
      , defaultValue:"USD"
   }
   , createdAt: { type:Date, optional:true }
   , deletedAt: { type:Date, optional:true }
   , allowStudentStudentChat : {type: Boolean, defaultValue: true}
   , lead :{type:Object, optional:true, blackbox :true}
});


SmartixSchoolsCol.attachSchema(SchoolsSchema);