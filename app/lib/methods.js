
/*****************************************************************************/
/* Client and Server Methods */
/*****************************************************************************/
Meteor.methods({
  /*
   * Example:
   *
   * '/app/items/insert': function (item) {
   *  if (this.isSimulation) {
   *    // do some client stuff while waiting for
   *    // result from server.
   *    return;
   *  }
   *
   *  // server method logic
   * }
   */
   /*'user/create':function(userObj){

     if(!lodash.has(userObj,'dob')){
       userObj.dob="";
     }

     Accounts.createUser({
       email : userObj.email,
       password : userObj.password,
       profile:{
         firstname : userObj.first,
         lastname : userObj.last,
         role    : userObj.role,
         dob = userObj.dob
       }

       })
   },*/

   'signup/email':function(doc){

     if(!lodash.has(doc,'dob')){
       doc.dob="";
     }

     Accounts.createUser({
       email : doc.email,
       password : doc.password,
       profile:{
         firstname : doc.firstname,
         lastname : doc.lastname,
         role    : doc.role,
         dob : doc.dob
       }
    });
   },

   'user/role/update':function(role){
     /*var userObj  = Meteor.user();
     userObj.profile.role = role;
     Meteor.users.upsert(Meteor.userId(),{$set:userObj},function(err){
          if(err){
            console.log(err);
            return err;
          }else{
            return
          }
       });*/

       Meteor.users.update({_id:Meteor.userId()},{$set:{'profile.role':role}},function(err){
         if(err){
           console.log(err);
           return err;
         }else{
           return true;
         }
      });


   },
   'class/search':function(classCode){
    //  check(doc,Schema.joinClass)
    //  Classes.update(doc,{$addToSet:{"joinedUserId":Meteor.userId()}});
    var query={};
    query.classCode=classCode;
    query.createBy = {$ne:Meteor.userId()};
    return Classes.findOne(query)||false;
   },
   'class/join':function(doc){
     check(doc,Schema.joinClass);
     Classes.update(doc,{$addToSet:{"joinedUserId":Meteor.userId()}});
   },
   'class/leave':function(classId){
     /*check(doc,Schema.leaveClass)*/
     /*Classes.update(doc,{$pull:{"joinedUserId":Meteor.userId()}});*/
     Classes.update({_id:classId},{$pull:{"joinedUserId":Meteor.userId()}});
   },
   'class/leaveByCode':function(classCode){
     /*check(doc,Schema.leaveClass)*/
     /*Classes.update(doc,{$pull:{"joinedUserId":Meteor.userId()}});*/
     Classes.update({classCode:classCode},{$pull:{"joinedUserId":Meteor.userId()}});
   },
   'class/deleteUser':function(classObj){

     Classes.update(classObj,{$set:{joinedUserId:[]}});
   },
   'class/delete':function(classObj){
      Classes.remove(classObj);
   },
   'class/update':function(doc){
      Classes.update({_id:doc._id},{$set:doc});
   },
   'chat/SendMessage':function(chatRoomId,text){
     var pushObj = {};
       pushObj.from = Meteor.userId();
       pushObj.sendAt = moment().format('x');
       pushObj.text = text;

     Chat.update(chatRoomId,{$push:{messagesObj:pushObj}});

   },
   'chat/SendImage':function(chatRoomId,pushObj){
    //  var pushObj = {};
    //    pushObj.from = Meteor.userId();
    //    pushObj.sendAt = moment().format('x');
    //    pushObj.text = text;

     Chat.update(chatRoomId,{$push:{messagesObj:pushObj}});

   },
   'getUserByIdArr':function(chatIds){
     lodash.pull(chatIds,Meteor.userId());
     return Meteor.users.findOne({_id:{$in:chatIds}});
   },
   'profile/edit':function(doc){



      var email = doc.email;
      doc = lodash.omit(doc,'email');
      var _id = Meteor.userId();

      var ModifiedDoc = lodash.assign(Meteor.user().profile,doc);

      Meteor.users.update({_id:_id},{$set:{profile:ModifiedDoc}});
      var  emailarr = lodash.map(Meteor.user().emails,'address');

      if(!lodash.includes(emailarr,email)){
          Meteor.users.update({_id:Meteor.user()._id}, {$push:{emails:{address:email,"verified":false}}});
      }


      /*Meteor.users.update({_id:Meteor.userId()},{$set:{'emails.$.items.0.address':}});*/
   }




});
