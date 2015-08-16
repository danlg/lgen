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
   'user/create':function(userObj){
     Accounts.createUser({
       email : userObj.email,
       password : userObj.password,
       profile:{
         firstname : userObj.first,
         lastname : userObj.last,
         role    : userObj.role
       }
       })
   },

   'signup/email':function(doc){
     Accounts.createUser({
       email : doc.email,
       password : doc.password,
       profile:{
         firstname : doc.firstname,
         lastname : doc.lastname,
         role    : doc.role
       }
    })
   },

   'user/role/update':function(role){
     var userObj  = Meteor.user();
     userObj.profile.role = role;
     Meteor.users.upsert(Meteor.userId(),{$set:userObj},function(err){
          if(err){
            console.log(err);
            return err;
          }else{
            return
          }
       });
   },
   'class/join':function(doc){
     check(doc,Schema.joinClass)
     Classes.update(doc,{$push:{"joinedUserId":Meteor.userId()}});
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
      Classes.update({classCode:doc.classCode},{$set:doc});
   },
   'chat/SendMessage':function(chatRoomId,text){
     var pushObj = {};
       pushObj.from = Meteor.userId();
       pushObj.sendAt = new Date;
       pushObj.text = text;

     Chat.update({_id:chatRoomId},{$push:{messagesObj:pushObj}});

   },
   'getUserByIdArr':function(chatIds){
     lodash.pull(chatIds,this.userId);
     return Meteor.users.findOne({_id:{$in:chatIds}})
   }




});
