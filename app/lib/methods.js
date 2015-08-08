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

   'user/role/update':function(role){
     Meteor.users.update(Meteor.userId(),{$set:{"profile":{"role":role}}},function(err){
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
   'class/leave':function(doc){
     check(doc,Schema.leaveClass)
     Classes.update(doc,{$pull:{"joinedUserId":Meteor.userId()}});
   },
   'class/deleteUser':function(classObj){

     Classes.update(classObj,{$set:{joinedUserId:[]}});
   },
   'class/delete':function(classObj){
      Classes.remove(classObj);
   }




});
