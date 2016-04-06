/**
 * The global namespace/collection for Relationships.
 * @namespace Relationships
 */
Relationships = new Mongo.Collection('relationships');

RelationshipsSchema = new SimpleSchema({
   parent:{
       type:String,
   },
   child:{
       type:String,
   },
   type:{
       type:String,
   },
   namespace:{
       type:String,
   },
   name:{
       type:String
   }
    
});


Relationships.attachSchema(RelationshipsSchema);