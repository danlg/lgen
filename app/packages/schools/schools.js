/**
 * The global namespace/collection for Schools.
 * @namespace Schools
 */
SmartixSchoolsCol = new Mongo.Collection('schools');

SchoolsSchema = new SimpleSchema({
   name:{
        type:String,
   },
   username:{
       type:String,
       unique: true      
   },
   logo:{
       type:String,
   },
   tel:{
       type:String,
   },
   web:{
       type:String
   },
   email:{
       type:String
   },
   active:{
       type:Boolean
   },
   deletedAt:{
       type:Number,
       optional:true
   },
   preferences:{
       type: Object,
       blackbox: true
   }
    
});


SmartixSchoolsCol.attachSchema(SchoolsSchema);