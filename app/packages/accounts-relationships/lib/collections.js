/**
 * The global namespace/collection for Relationships.
 * @namespace Relationships
 */

import { Meteor } from 'meteor/meteor'

Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.Relationships = Smartix.Accounts.Relationships || {};

Smartix.Accounts.Relationships.Collection = new Mongo.Collection('relationships');
//see http://matteodem.github.io/meteor-easy-search/docs/recipes/

//not sure this is actually required now that we put the shadow data inside the users table
Smartix.Accounts.UsersComposite = Meteor.users;

//console.log("Smartix.Accounts.UsersComposite", Smartix.Accounts.UsersComposite);
//console.log("Smartix.Accounts.UsersComposite.before", Smartix.Accounts.UsersComposite.before);

// Smartix.Accounts.UsersComposite.before.insert(function (userId, doc) {
//     console.log ("inserting ", userId, doc);
//     if (doc.profile.firstName && doc.profile.lastName) {
//         console.log ("inserting FN", fullNameComposite(doc));
//         doc.fullName = fullNameComposite(doc);
//     }
//     // else{
//     //     console.log ("Cannot insert ", userId, doc);
//     // }
// });
//
// Smartix.Accounts.UsersComposite.before.update(function (userId, doc, fieldNames, modifier) {
//     if (doc.profile.firstName && doc.profile.lastName) {
//         modifier.$set = modifier.$set || {};
//         modifier.$set.fullName = fullNameComposite(doc);
//     }
// });

// var getClassroom = (doc, uid, namespace) => {
//     if (doc.classroom) {
//         return doc.classroom;
//     }
//     else{
//         if (Roles.userIsInRole(uid, Smartix.Accounts.School.PARENT, namespace) ) {
//             if (parentMapH [uid]){
//                 console.log ("inserting ", userId, doc);
//                 doc.classroom =  parentMapH [uid].classrooms;
//                 return doc.classroom;
//             }
//         }
//         return "";
//     }
// };
//once collection is in minimongo that's it


//  if (Meteor.isServer) {
//      console.log("======================================================================");
//      console.log("server");
//      var parentMapLoaded = false;
//
//      var buildParentMap = () => {
//          console.log("buildParentMap");
//         let relationshipCursor = Smartix.Accounts.Relationships.Collection.find();
//         let parentMapTmp = {};
//         relationshipCursor.forEach((relation) => {
//             let value = {};
//             value.classrooms = findClassroom(relation.child);
//             value.grades = findGrade(relation.child);//todo changeme
//             parentMapTmp [relation.parent] = value;
//         });
//         //log.info("parentmap.size-IMPL", Object.keys(parentMapTmp).length);
//         console.log("parentmap.size-IMPL", Object.keys(parentMapTmp).length);
//         //log.info("parentmap", parentMap);
//         return parentMapTmp;
//     };
//    
//     Smartix.Accounts.UsersComposite.before.insert(function (userId, doc) {
//         console.log ("inserting ", userId, doc);
//         if (!parentMapLoaded) {
//             console.log("Loading parent map");
//             buildParentMap();
//             parentMapLoaded = true;
//         }
//         // let parentMapH =  buildParentMap();
//         // let userCursor = Smartix.Accounts.Relationships.Collection.find();
//         // {
//         //
//         // }
//         let namespace = UI._globalHelpers['getCurrentSchoolId']();
//         if (Roles.userIsInRole(uid, Smartix.Accounts.School.PARENT, namespace) ) {
//             //doc.classroom = getClassroom(doc, uid, namespace);
//             doc.classroom_shadow = "****CLASS" +uid;
//         }
//
//     });
// }
// else {
//     console.log("client");
// }

// Smartix.Accounts.UsersComposite.before.update(function (userId, doc, fieldNames, modifier) {
//     // if (doc.profile.firstName && doc.profile.lastName) {
//         modifier.$set = modifier.$set || {};
//         modifier.$set.classroom =  "HARDCODED_CLASSROOM"; //getClassroom(doc, uid, namespace);
//     // }
// });

// var findClassroom = (uid) => {
//     let user = Meteor.users.findOne({_id: uid});
//     if (user) {
//         if (user.classroom) {
//             return user.classroom;
//         }
//     }
//     // else { log.info("Cannot find classroom for user ", uid);}
// };
// var findGrade = (uid) => {
//     let user = Meteor.users.findOne({_id: uid});
//     if (user) {
//         if (user.grade) {
//             return user.grade;
//         }
//     }
//     // else {     log.info("Cannot find grade for user ", uid); }
// };
//
// const fullNameComposite = doc => {
//     return doc.profile.firstName + ' ' + doc.profile.lastName;
// };

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