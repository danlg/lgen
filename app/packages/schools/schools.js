/**
 * The global namespace/collection for Schools.
 * @namespace Schools
 */
SmartixSchoolsCol = new Mongo.Collection('schools');

SchoolsSchema = new SimpleSchema({
   name:{ type:String //the long name
   }
   , username:{  type:String//the name in the URL
     , unique: true
   }
   , logo:{ type:String
   }
   , tel:{ type:String
   }
   , web:{ type:String //URL
   }
   , email:{ type:String
   }
   , active:{ type:Boolean
   }
   , deletedAt:{ type:Number
      , optional:true
   },
   preferences:{ type: Object
      , blackbox: true
   }
   , country: {type:String, optional:true}
   , address1: {type:String, optional:true}
   , address2: {type:String, optional:true}
   , postalCode: {type:String, optional:true}
   , city: {type:String, optional:true}
   , preferredLanguage: {type:String, optional:true}
   , createdAt: { type:Date }

   //plan fields
   , planStartDate: { type:String
      , optional:true
   }
   , planChosen: { type:String
      , optional:true //links to plan.planName
   }
   , planTrialExpiryDate:{ type:Date
   }
   , planExpiryDate:{ type:Date
      , optional:true
   }
   //cumulates the revenues from this school help to estimate LTV
   , revenueToDate: { type:Number //stored in chargebee ?
      , defaultValue:0
   }
   , revenueToDateCcy: { type:String
      , defaultValue:"USD"
   }

});


SmartixSchoolsCol.attachSchema(SchoolsSchema);