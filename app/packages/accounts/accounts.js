Smartix = Smartix || {};

Smartix.Accounts = Smartix.Accounts || {};

Smartix.Accounts.listUserSchools = function () {
        
        var userToBeChecked = user || Meteor.userId();
        return Roles.getGroupsForUser(userToBeChecked);  
}

Smartix.Accounts.removeNonExistentUsers = function (users) {
  // Checks `users` is an array of Strings
  check(users, [String]);

  // Checks if all the users exists
  if (users.length === Meteor.users.find({
    _id: {
      $in: users
    }
  }).count()) {
    // If all users exists, return the `users` as-is
    return users;
  } else {
    // if not all users exists, filter the `users` array
    // to include only existing users
    return _.filter(users, function (userId, i, array) {
      return Meteor.users.findOne({_id: userId});
    }
  }
}

if(Meteor.isServer){
    Meteor.methods({
        'smartix:accounts/deleteUser':function(id){
           var targetUser = Meteor.users.findOne(id);
           
            if(
              Roles.userIsInRole(Meteor.userId(),'admin','system')
             ){
              
              //Perform `update` operation using `alanning:roles`,
              //removing the appropriate object from the `roles` array
              //Roles.removeUsersFromRoles(user,['user'],'global')
              
              //Soft-delete user should not be done in school-level
               Meteor.users.update({_id: user},  {$set: {deleted : true,deletedAt: (new Date()).getTime()}}  );
               
            }
                      
        },
        'smartix:accounts/editUser':function(id,options,namespace){
           var targetUser = Meteor.users.findOne(id);
           if(!targetUser){
               return;
           }
           
           if(Meteor.userId() == id ||
              Roles.userIsInRole(Meteor.userId(),'admin','system') ||
              Roles.userIsInRole(Meteor.userId(),'admin',namespace)
             )
           {
              //if it is normal user, cannot change self's role 
              if(!Roles.userIsInRole(Meteor.userId(),'admin','system') && !Roles.userIsInRole(Meteor.userId(),'admin',namespace)){
                 delete options.roles;
              }
              //console.log(options.doc);
              
              //`lodash.merge` would do a recursive operations to update the fields passed from `options`.
              var ModifiedDoc = lodash.merge(targetUser, options);              
              //console.log(ModifiedDoc);
              Meteor.users.update({_id: id},  ModifiedDoc  );
       
           }            
           
        }        
    });    
}
