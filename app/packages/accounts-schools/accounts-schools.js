Smartix = Smartix || {};
Smartix.accounts = Smartix.accounts || {};

Smartix.accounts.isUserSchoolAdmin = function(namespace,user){
    
    var userToBeChecked = user || Meteor.userId();
    return Roles.userIsInRole(userToBeChecked,'admin',namespace);
}

