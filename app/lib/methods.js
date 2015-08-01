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
   'user/role/update':function(role){
     Meteor.users.update(Meteor.userId(),{$set:{"profile":{"role":role}}},function(err){
          if(err){
            console.log(err);
            return err;
          }else{
            return
          }
       });
   }


});
