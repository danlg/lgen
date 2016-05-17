/**
 * The global namespace/collection for Relationships.
 * @namespace Relationships
 */

Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.Relationships = Smartix.Accounts.Relationships || {};

Smartix.Accounts.Relationships.Collection = new Mongo.Collection('relationships');

Smartix.Accounts.Relationships.Schema = new SimpleSchema({
   parent:{
       type:String
   },
   child:{
       type:String
   },
   namespace:{
       type:String
   },
   name:{
       type:String
   }
});

Smartix.Accounts.Relationships.Collection.attachSchema(Smartix.Accounts.Relationships.Schema);