Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};

Smartix.Accounts.isUserSchoolAdmin = function(namespace,user){
    
    var userToBeChecked = user || Meteor.userId();
    return Roles.userIsInRole(userToBeChecked,'admin',namespace);
}

