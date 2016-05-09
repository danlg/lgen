/*
The plan collection
 */
SmartixPlanColl = new Mongo.Collection('plan');
//see chargebee do not add too many fields
PlansSchema = new SimpleSchema({
  planName: { type:String
  },
  //in chargebeebee ?
  priceAmount: { type:Number
  },
  priceCcy: { type:String
  },
  duration: { type:String
  },
  hasStudentLicenseLimit: { type:Boolean
    , defaultValue: false
  },
  studentLicenseLimit: { type: Number
    , defaultValue: 50
  },
  //promoCode: { type:[String] / specify in chargebee
  //},
  active: { type:Boolean
    , defaultValue:true
  },
  deletedAt: { type:Date
    , optional:true
  },
  validUntil: { type:Date
    , optional:true
  }

});

SmartixPlanColl.attachSchema(PlansSchema);