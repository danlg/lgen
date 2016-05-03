Match.Maybe = Match.Maybe || Match.Optional;

Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.System = Smartix.Accounts.System || {};

///////////////
// CONSTANTS //
///////////////

Smartix.Accounts.System.NAMESPACE = 'system';
Smartix.Accounts.System.VALID_USER_TYPES = ['admin'];

Smartix.Accounts.System.isAdmin = function (currentUser) {
    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    return Roles.userIsInRole(currentUser, 'admin', Smartix.Accounts.System.NAMESPACE)
}

Smartix.Accounts.System.canCreateUser = function (types, currentUser) {
    // Check if the type given is one of the valid types
    check(types, Match.Where(function (val) {
        if(!Array.isArray(types)) {
            return false;
        }
        _.each(val, function (type) {
            if (Smartix.Accounts.System.VALID_USER_TYPES.indexOf(val) < 0) {
                return false;
            }
        });
        return true;
    }));
    
    // Only admin users can create other admin users
    return Smartix.Accounts.System.isAdmin();
}

Smartix.Accounts.System.canRemoveUser = function (userId, currentUser) {
        
    check(userId, Match.Maybe(String));
    check(currentUser, String);
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Only if there are more than one admin user
    return Roles.getUsersInRole('admin', 'system').count() > 1
    // AND if the current user is a admin user
        && Smartix.Accounts.System.isAdmin();
}

Smartix.Accounts.System.canGetUserInfo = function (userId, currentUser) {
    
    check(userId, Match.Maybe(String));
    check(currentUser, String);
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Return `true` if
    // The user info requested is by the current user
    return userId === currentUser
    
    // Or if the currently-logged in user is an admin for the system
      || Smartix.Accounts.System.isAdmin(currentUser)
}

Smartix.Accounts.System.canGetBasicInfoOfAllUsers = function (currentUser) {
    
    check(currentUser, String);
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Only system admins can get the list of ALL users in the system namespace
    return Smartix.Accounts.System.isAdmin(currentUser);
}

Smartix.Accounts.System.canGetAllUsers = function (currentUser) {
        
    check(currentUser, String);
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Only system admins can get the list of ALL users in the system namespace
    return Smartix.Accounts.System.isAdmin(currentUser);
}